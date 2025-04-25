import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDynamicViewField, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoUploadComponent } from '@po-ui/ng-components';
import { ImportsService } from './imports.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.css']
})
export class ImportsComponent implements OnInit{
  @ViewChild('ediModal', {static: true}) ediModal!: PoModalComponent;
  @ViewChild('excelModal', {static: true}) excelModal!: PoModalComponent;
  @ViewChild('importInfoModal', {static: true}) importInfoModal!: PoModalComponent;
  @ViewChild('ediUploadComponent', {static: true}) ediUploadComponent!: PoUploadComponent;

  protected pageActions: PoPageAction[] = [
    {
      label: 'EDI',
      action: this.openEDIModal.bind(this)
    },
    {
      label: 'Excel',
      action: this.openExcelModal.bind(this)
    }
  ];

  protected tableActions: PoTableAction[] = [
    {
      label: 'Visualizar',
      icon: 'po-icon-eye',
      action: this.openImportInfoModal.bind(this)
    }
  ]

  protected tableHeight: number = window.innerHeight / 1.5;
  protected importsColumns: PoTableColumn[] = [];
  protected importsItems: any[] = [];
  protected importsFields: PoDynamicViewField[] = [];
  protected currentImportInView: any = {};

  constructor(
    private importsService: ImportsService,
    private cookieService: CookieService,
    private poNotification: PoNotificationService
  ){
    this.importsColumns = importsService.GetImportsColumns();
    this.importsFields = importsService.GetImportsFields();
  }

  async ngOnInit(): Promise<void> {
    this.importsItems = await this.importsService.GetImportsItems();
  }

  protected openEDIModal(){
    this.ediModal.open();
  }

  protected openExcelModal(){
    this.excelModal.open();
  }

  protected openImportInfoModal(selectedItem: any){
    this.currentImportInView = selectedItem;
    this.importInfoModal.open();
  }

  protected async onUpload() {
    const uploadItem: any = this.ediUploadComponent['currentFiles'][0];

    const file: File = uploadItem.rawFile;
    const salesmanId = this.cookieService.get('salesmanId');


    if (file) {
      const base64 = await this.convertToBase64(file);
  
      const requestJson = {
        "VENDEDOR": salesmanId,
        "TIPO": "EDI",
        "ARQUIVO": uploadItem.name,
        "BASE64": base64
      };
    
      const response = await this.importsService.PostImportItem(requestJson);

      if(response['codigo'] == 201){
        this.ediModal.close();
        this.poNotification.success(response['mensagem']);
      }
    }
  }
  
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Remove o prefixo data:...
        resolve(base64String);
      };
  
      reader.onerror = error => reject(error);
    });
  }
  
}
