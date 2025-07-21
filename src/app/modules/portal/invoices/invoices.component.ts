import { Component, ViewChild } from '@angular/core';
import { PoButtonGroupItem, PoDynamicViewField, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Invoice } from 'src/app/models/invoice/invoice';
import { AuthService } from 'src/app/services/auth/auth.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';

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
      action: () => this.downloadDanfe()
    },
    {
      label: 'XML',
      action: () => this.downloadXml()
    },
    {
      label: 'Boleto',
      action: () => this.downloadBoleto()
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
      action: this.openDownloadDanfeModal.bind(this)
    }
  ];

  //Itens Da Tabela De Clientes
  protected invoicesColumns: PoTableColumn[] = [];
  protected invoicesItemsColumns: PoTableColumn[] = [];
  protected invoicesHeaderItems: Invoice[] = [];
  protected invoicesItems: any[] = [];
  protected invoicesFields: PoDynamicViewField[] = [];
  protected currentInvoiceInView: Invoice = {};
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';

  constructor(
    private invoicesService: InvoicesService,
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

  protected openDownloadDanfeModal(selectedItem: any){
    this.currentInvoiceInView = selectedItem;
    this.downloadsModal.open();
  }

  protected async downloadDanfe() {
    const requestJson = {
      NOTA: this.currentInvoiceInView['id'],
      SERIE: this.currentInvoiceInView['serial']
    };
  
    const response = await this.invoicesService.getDanfe(requestJson);
  
    if (response['codigo'] === 201 && response['base64']) {
      this.downloadBase64File(
        response['base64'],
        'application/pdf',
        `danfe_${this.currentInvoiceInView['id']}.pdf`
      );
    }
  }

  protected async downloadXml() {
    const requestJson = {
      NOTA: this.currentInvoiceInView['id'],
      SERIE: this.currentInvoiceInView['serial']
    };
  
    const response = await this.invoicesService.getXML(requestJson);
  
    if (response['codigo'] === 201 && response['base64']) {
      this.downloadBase64File(
        response['base64'],
        'application/xml',
        `xml_${this.currentInvoiceInView['id']}.xml`,
        true  // Forçar download
      );
    }
  }
  
  

  protected async downloadBoleto() {
    const requestJson = {
      NOTA: this.currentInvoiceInView['id'],
      SERIE: this.currentInvoiceInView['serial']
    };
  
    const response = await this.invoicesService.getBoleto(requestJson);
  
    if (response['codigo'] === 201 && response['base64']) {
      this.downloadBase64File(
        response['base64'],
        'application/pdf',
        `boleto_${this.currentInvoiceInView['id']}.pdf`
      );
    }
  }
  

  private downloadBase64File(base64Data: string, mimeType: string, fileName: string, forceDownload: boolean = false): void {
    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
  
    const blobUrl = URL.createObjectURL(blob);
  
    if (forceDownload) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } else {
      window.open(blobUrl, '_blank');
    }
  }
  
}
