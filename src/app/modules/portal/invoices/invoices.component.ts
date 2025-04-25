import { Component, ViewChild } from '@angular/core';
import { PoButtonGroupItem, PoDynamicViewField, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { InvoicesService } from './invoices.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {
  @ViewChild('downloadsModal', {static: true}) downloadsModal!: PoModalComponent;
  @ViewChild('invoiceInfoModal', {static: true}) invoiceInfoModal!: PoModalComponent;

  //Popup de downloads
  protected downloadButtons: PoButtonGroupItem[] = [
    {
      label: 'Danfe',
      action: () => {}
    },
    {
      label: 'XML',
      action: () => {}
    },
    {
      label: 'Boleto',
      action: () => {}
    },
  ];

  //Parametros Da Tabela
  protected tableHeight: number = window.innerHeight / 1.5;
  protected tableActions: PoTableAction[] = [
    {
      label: 'Visualizar',
      icon: 'po-icon-eye',
      action: this.openInvoiceInfoModal.bind(this)
    },
    {
      label: 'Downloads',
      icon: 'po-icon-download',
      action: () => this.downloadsModal.open()
    }
  ];

  //Itens Da Tabela De Clientes
  protected invoicesColumns: PoTableColumn[] = [];
  protected invoicesItemsColumns: PoTableColumn[] = [];
  protected invoicesHeaderItems: PoTableColumn[] = [];
  protected invoicesItems: any[] = [];
  protected invoicesFields: PoDynamicViewField[] = [];
  protected currentInvoiceInView: any;
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';

  constructor(
    private invoicesService: InvoicesService
  ){
    this.invoicesColumns = invoicesService.GetInvoicesColumns();
    this.invoicesItemsColumns = invoicesService.GetInvoicesItemsColumns();
    this.invoicesFields = invoicesService.GetInvoicesFields();
  }

  async ngOnInit(): Promise<void> {
    await this.LoadInvoices();
  }

  protected async LoadInvoices(){
    this.invoicesHeaderItems = await this.invoicesService.GetInvoicesItems(this.filter);
  }

  protected openInvoiceInfoModal(selectedItem: any){
    this.currentInvoiceInView = selectedItem;
    this.invoicesItems = selectedItem['items'];
    this.invoiceInfoModal.open();
  }

  protected onSearch(filter: string): any {
    this.page = -1;
    this.invoicesHeaderItems = [];
    this.filter = filter
    this.LoadInvoices()
  }

  protected onResetSearch(): any {
    this.page = -1;
    this.invoicesHeaderItems = [];
    this.filter = ''
    this.LoadInvoices()
  }
}
