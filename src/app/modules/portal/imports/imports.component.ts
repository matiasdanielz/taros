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
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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

  protected ediRestrictions: PoUploadFileRestrictions = {
    allowedExtensions: ['.txt']
  };

  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';
  protected tableHeight = window.innerHeight / 1.5;
  protected importsColumns: PoTableColumn[] = [];
  protected importsFields: PoDynamicViewField[] = [];
  protected importsItems: Import[] = [];
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
    this.importsItems = await this.importsService.GetImportsItems(this.filter);
  }

  protected openImportInfoModal(importItem: Import): void {
    this.currentImportInView = importItem;
    this.importInfoModal.open();
  }

  protected async onEdiUpload(): Promise<void> {
    const file = this.getUploadedFile(this.ediUploadComponent);
    if (!file) return;

    const request = await this.getUploadRequest('EDI', file);
    if (!request) return;

    await this.submitImport(request, this.ediModal);
    await this.loadItems();
  }

  protected async onExcelUpload(): Promise<void> {
    const file = this.getUploadedFile(this.excelUploadComponent);
    if (!file) return;

    const salesmanId = this.getSalesmanIdOrNotify();
    if (!salesmanId) return;

    const buffer = await file.arrayBuffer();
    const excelJson = await this.importsService.parseXlsxToGroupedJson(buffer);

    const request = {
      VENDEDOR: salesmanId,
      TIPO: 'EXCEL',
      ARQUIVO: file.name,
      EXCEL: excelJson
    };

    await this.submitImport(request, this.excelModal);
    await this.loadItems();
  }

  protected downloadExcelTemplate(): void {
    const sampleData = [{
      CNPJ: '58279696000117',
      PEDIDO_CLIENTE: '22',
      TIPO_FRETE: 'C',
      MENSAGEM_NOTA: 'MSG PARA NOTA',
      ITEM_DO_PEDIDO: '1',
      PRODUTO: '1110.100',
      QUANTIDADE: 10
    }];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = { Sheets: { 'Pedidos': worksheet }, SheetNames: ['Pedidos'] };
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'pedido.xlsx');
  }

  // Utilitários auxiliares

  private getUploadedFile(upload: PoUploadComponent): File | undefined {
    return upload['currentFiles']?.[0]?.rawFile;
  }

  private getSalesmanIdOrNotify(): string | null {
    const userId = this.authService.getSession()?.sessionInfo?.userId;
    if (!userId) {
      this.poNotification.error('Sessão expirada ou inválida. Faça login novamente.');
      return null;
    }
    return userId;
  }

  private async getUploadRequest(tipo: 'EDI' | 'EXCEL', file: File): Promise<any | null> {
    const salesmanId = this.getSalesmanIdOrNotify();
    if (!salesmanId) return null;

    if (tipo === 'EDI') {
      const base64 = await this.convertToBase64(file);
      return {
        VENDEDOR: salesmanId,
        TIPO: tipo,
        ARQUIVO: file.name,
        BASE64: base64
      };
    }

    return null; // Excel tem lógica separada no método próprio
  }

  private async submitImport(request: any, modal: PoModalComponent): Promise<void> {
    try {
      const response = await this.importsService.PostImportItem(request);
      response?.codigo === 201
        ? (modal.close(), this.poNotification.success(response.mensagem))
        : this.poNotification.error(response?.mensagem || 'Erro ao processar a importação.');
    } catch (error) {
      this.poNotification.error('Erro inesperado ao enviar o arquivo.');
      console.error(error);
    }
  }

  private async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  protected onSearch(filter: string): any {
    this.page = -1;
    this.importsItems = [];
    this.filter = filter
    this.loadItems()
  }

  protected onResetSearch(): any {
    this.page = -1;
    this.importsItems = [];
    this.filter = ''
    this.loadItems()
  }
}
