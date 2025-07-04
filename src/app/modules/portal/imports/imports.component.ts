import {
  Component, OnInit, ViewChild
} from '@angular/core';
import {
  PoDynamicViewField,
  PoModalComponent,
  PoNotificationService,
  PoPageAction,
  PoTableAction,
  PoTableColumn,
  PoUploadComponent,
  PoUploadFileRestrictions
} from '@po-ui/ng-components';
import { Import } from 'src/app/models/import/import';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ImportsService } from 'src/app/services/imports/imports.service';

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.css']
})
export class ImportsComponent implements OnInit {
  @ViewChild('ediModal', { static: true }) ediModal!: PoModalComponent;
  @ViewChild('excelModal', { static: true }) excelModal!: PoModalComponent;
  @ViewChild('importInfoModal', { static: true }) importInfoModal!: PoModalComponent;
  @ViewChild('ediUploadComponent', { static: true }) ediUploadComponent!: PoUploadComponent;
  @ViewChild('excelUploadComponent', { static: true }) excelUploadComponent!: PoUploadComponent;

  protected pageActions: PoPageAction[] = [
    { label: 'EDI', action: () => this.ediModal.open() },
    { label: 'Excel', action: () => this.excelModal.open() },
    { label: 'Atualizar Listagem', action: () => this.loadItems() }
  ];

  protected tableActions: PoTableAction[] = [
    {
      label: 'Visualizar',
      icon: 'po-icon-eye',
      action: (item: Import) => this.openImportInfoModal(item)
    }
  ];

  protected ediRestrictions: PoUploadFileRestrictions = { allowedExtensions: ['.txt'] };

  protected tableHeight: number = window.innerHeight / 1.5;
  protected importsColumns: PoTableColumn[] = [];
  protected importsItems: Import[] = [];
  protected importsFields: PoDynamicViewField[] = [];
  protected currentImportInView: Import = {};

  constructor(
    private importsService: ImportsService,
    private poNotification: PoNotificationService,
    private authService: AuthService
  ) {
    this.importsColumns = this.importsService.GetImportsColumns();
    this.importsFields = this.importsService.GetImportsFields();
  }

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  protected async loadItems(): Promise<void> {
    this.importsItems = await this.importsService.GetImportsItems();
  }

  protected openImportInfoModal(selectedItem: Import): void {
    this.currentImportInView = selectedItem;
    this.importInfoModal.open();
  }

  protected async onEdiUpload(): Promise<void> {
    const file = this.getUploadedFile(this.ediUploadComponent);
    if (!file) return;

    const salesmanId = this.getSalesmanIdOrNotify();
    if (!salesmanId) return;

    const base64 = await this.convertToBase64(file);
    const requestJson = {
      VENDEDOR: salesmanId,
      TIPO: 'EDI',
      ARQUIVO: file.name,
      BASE64: base64
    };

    await this.submitImport(requestJson, this.ediModal);
  }

  protected async onExcelUpload(): Promise<void> {
    const file = this.getUploadedFile(this.excelUploadComponent);
    if (!file) return;

    const salesmanId = this.getSalesmanIdOrNotify();
    if (!salesmanId) return;

    const text = await this.readFileAsText(file);
    const json = await this.importsService.parseCsvToGroupedJson(text);

    const requestJson = {
      VENDEDOR: salesmanId,
      TIPO: 'EXCEL',
      ARQUIVO: file.name,
      EXCEL: json
    };

    await this.submitImport(requestJson, this.excelModal, true);
  }

  protected downloadExcelTemplate(): void {
    const link = document.createElement('a');
    link.href = './assets/files/template.xlsx';
    link.download = 'template.xlsx';
    link.click();
  }

  // Utilitários reutilizáveis

  private getUploadedFile(component: PoUploadComponent): File | undefined {
    const uploadItem = component['currentFiles']?.[0];
    return uploadItem?.rawFile;
  }

  private getSalesmanIdOrNotify(): string | null {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;

    if (!salesmanId) {
      this.poNotification.error('Sessão expirada ou inválida. Faça login novamente.');
      return null;
    }

    return salesmanId;
  }

  private async submitImport(request: any, modalToClose: PoModalComponent, reload: boolean = false): Promise<void> {
    try {
      const response = await this.importsService.PostImportItem(request);

      if (response?.codigo === 201) {
        modalToClose.close();
        this.poNotification.success(response.mensagem);
        if (reload) await this.loadItems();
      } else {
        this.poNotification.error(response?.mensagem || 'Erro ao processar a importação.');
      }
    } catch (err) {
      this.poNotification.error('Erro inesperado ao enviar o arquivo.');
      console.error(err);
    }
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
    });
  }
}
