import {
  Component, EventEmitter, Output, ViewChild, OnInit
} from '@angular/core';
import {
  PoModalComponent, PoDynamicFormComponent, PoStepperComponent,
  PoTableColumn, PoTableAction, PoNotificationService,
  PoDynamicFormFieldChanged, PoDynamicFormValidation
} from '@po-ui/ng-components';
import { SalesBudgetsService } from 'src/app/services/salesBudgets/sales-budgets.service';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { SalesBudgetItemModalComponent } from '../sales-budget-item-modal/sales-budget-item-modal.component';

enum Step {
  Header = 0,
  Items = 1,
  Summary = 2
}

@Component({
  selector: 'app-sales-budget-header-modal',
  templateUrl: './sales-budget-header-modal.component.html',
  styleUrls: ['./sales-budget-header-modal.component.css']
})
export class SalesBudgetHeaderModalComponent implements OnInit {
  @ViewChild('salesBudgetHeaderModal') private modal!: PoModalComponent;
  @ViewChild('salesBudgetItemModal') private salesBudgetItemModal!: SalesBudgetItemModalComponent;
  @ViewChild('salesBudgetHeaderForm') private headerForm!: PoDynamicFormComponent;
  @ViewChild('salesBudgetStepper') private stepper!: PoStepperComponent;

  @Output() onSave = new EventEmitter<void>();

  protected isEditMode = false;
  protected salesBudgetFields: any[] = [];
  protected salesBudgetValue: any = {};
  protected tableColumns: PoTableColumn[] = [];
  protected tableItems: any[] = [];
  protected removedItems: any[] = [];

  protected currentStep: Step = Step.Header;

  readonly tableActions: PoTableAction[] = [
    { label: 'Editar', icon: 'po-icon-edit', action: this.editItem.bind(this) },
    { label: 'Excluir', icon: 'po-icon-delete', type: 'danger', action: this.removeItem.bind(this) }
  ];

  constructor(
    private service: SalesBudgetsService,
    private poNotification: PoNotificationService,
    private customersService: CustomersService
  ) {}

  ngOnInit(): void {
    this.tableColumns = this.service.GetSalesBudgetsItemsColumns();
    this.salesBudgetFields = this.service.GetSalesBudgetsHeaderFields();
  }

  open(item?: any): void {
    this.isEditMode = !!item;
    this.currentStep = Step.Header;
    this.stepper.active(0);

    if (this.isEditMode) {
      this.salesBudgetValue = {
        CJ_NUM: item.orderNumber,
        CJ_CLIENTE: item.customerCode,
        CJ_TPFRETE: item.shippingMethod,
        CJ_LOJA: item.store
      };
      this.tableItems = item.items || [];
      this.onChangeFields({ property: 'CJ_CLIENTE', value: this.salesBudgetValue['CJ_CLIENTE'] });
      this.calculateTaxes();
    } else {
      this.salesBudgetValue = {};
      this.tableItems = [];
    }

    this.updateTotalsRow();
    this.modal.open();
  }

  cancel(): void {
    this.modal.close();
  }

  onChangeStep(event: any): void {
    const map: Record<string, Step> = {
      'Cabeçalho': Step.Header,
      'Itens': Step.Items,
      'Resumo': Step.Summary
    };
    this.currentStep = map[event.label] ?? Step.Header;
  }

  canActiveNextStep(): boolean {
    if (this.currentStep === Step.Header && this.headerForm?.form?.invalid) {
      this.poNotification.error('Preencha os campos obrigatórios!');
      return false;
    }

    if (this.currentStep === Step.Items && this.tableItems.length === 0) {
      this.poNotification.error('Adicione ao menos um item!');
      return false;
    }

    return true;
  }

  openItemModal(): void {
    const next = this.getNextItemNumber();
    this.salesBudgetItemModal.openAdd(next, this.salesBudgetValue['CJ_CLIENTE']);
  }

  editItem(item: any): void {
    this.salesBudgetItemModal.openEdit(item, this.salesBudgetValue['CJ_CLIENTE']);
  }

  async onSalesBudgetItemCreated(item: any): Promise<void> {
    item.__isNew = true;
    this.tableItems.push(item);
    await this.calculateTaxes();
    this.updateTotalsRow();
  }

  async onSalesBudgetItemEdited(item: any): Promise<void> {
    const index = this.tableItems.findIndex(i => i.CK_ITEM === item.CK_ITEM);
    if (index > -1) this.tableItems[index] = item;
    await this.calculateTaxes();
    this.updateTotalsRow();
  }

  removeItem(item: any): void {
    if (this.isEditMode && !item.__isNew) {
      item.AUTDELETA = 'S';
      item.LINPOS = item.CK_ITEM;
      this.removedItems.push(item);
    }
    this.tableItems = this.tableItems.filter(i => i !== item);
    this.updateTotalsRow();
  }

  private getNextItemNumber(): string {
    const numbers = this.tableItems
      .filter(i => i.CK_ITEM !== 'TOTALIZADOR')
      .map(i => parseInt(i.CK_ITEM, 10));
    const max = Math.max(0, ...numbers);
    return (max + 1).toString().padStart(2, '0');
  }

  async calculateTaxes(): Promise<void> {
    const header = {
      ...this.salesBudgetValue,
      C5_CLIENTE: this.salesBudgetValue['CJ_CLIENTE'],
      C5_LOJACLI: '01',
      C5_LOJA: '01',
      C5_TPFRETE: this.salesBudgetValue['CJ_TPFRETE'],
      C5_TABELA: this.salesBudgetValue['C5_TABELA'] ?? '999',
      C5_CONDPAG: this.salesBudgetValue['C5_CONDPAG'] ?? '002',
      C5_TIPO: 'N',
      ITENS: this.tableItems.filter(i => i.CK_ITEM !== 'TOTALIZADOR')
    };

    const res = await this.service.GetSalesBudgetTaxes(header);
    if (res?.ITENS?.length) {
      this.tableItems = this.tableItems.map(i => {
        const match = res.ITENS.find((r: any) => r.IT_ITEM === i.CK_ITEM);
        return match ? { ...i, ...match } : i;
      });
    }
  }

  isSubmitDisabled(): boolean {
    return this.headerForm?.form?.invalid || this.tableItems.length === 0;
  }

  async onSubmit(): Promise<void> {
    const payload = this.buildPayload();

    const response = this.isEditMode
      ? await this.service.PutSalesBudget(payload)
      : await this.service.PostSalesBudget(payload);

    if (response?.codigo === 201) {
      this.poNotification.success(this.isEditMode ? 'Registro Editado com Sucesso' : 'Registro Criado com Sucesso');
      this.onSave.emit();
      this.removedItems = [];
      this.modal.close();
    } else {
      this.poNotification.error(response?.mensagem || 'Erro ao salvar orçamento');
    }
  }

  buildPayload(): any {
    const payload = { ...this.salesBudgetValue, CJ_LOJACLI: '01' };

    const items = this.tableItems
      .filter(i => i.CK_ITEM !== 'TOTALIZADOR')
      .map(i => ({
        ...i,
        CK_OPER: '01',
        CK_PRODUTO: i.IT_PRODUTO?.trim(),
        CK_QTDVEN: i.IT_QUANT,
        LINPOS: i.CK_ITEM,
        AUTDELETA: i.__isNew ? 'N' : (i.AUTDELETA ?? 'N')
      }));

    payload.ITENS = [...items, ...this.removedItems];

    return payload;
  }

  async onChangeFields(changed: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation> {
    if (changed.property === 'CJ_CLIENTE') {
      const id = changed.value?.id;
      const [customer]: any = await this.customersService.GetCustomersItems(id);
      if (customer) {
        this.salesBudgetValue = {
          ...this.salesBudgetValue,
          customerAdress: customer.adress,
          paymentCondition: customer.paymentCondition,
          priceTable: customer.priceTable,
          carrier: customer.carrier,
          CJ_TPFRETE: customer.shippingMethod
        };
      }
    }

    return {};
  }

  private updateTotalsRow(): void {
    this.tableItems = this.tableItems.filter(i => i.CK_ITEM !== 'TOTALIZADOR');

    const sum = (key: string) =>
      this.tableItems.reduce((total, item) => total + (parseFloat(item[key]) || 0), 0).toFixed(2);

    const total = {
      CK_ITEM: 'TOTALIZADOR',
      CK_PRODUTO: '',
      B1_DESC: '',
      CK_QTDVEN: sum('CK_QTDVEN'),
      IT_PRCUNI: sum('IT_PRCUNI'),
      IT_VALMERC: sum('IT_VALMERC'),
      IT_VALICM: sum('IT_VALICM'),
      IT_VALSOL: sum('IT_VALSOL'),
      IT_VALIPI: sum('IT_VALIPI'),
      IT_DIFAL: sum('IT_DIFAL'),
      IT_SLDPROD: sum('IT_SLDPROD')
    };

    this.tableItems = [...this.tableItems, total];
  }
}
