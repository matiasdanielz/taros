import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDynamicViewField, PoModalComponent, PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { ImportsService } from './imports.service';

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.css']
})
export class ImportsComponent implements OnInit{
  @ViewChild('ediModal', {static: true}) ediModal!: PoModalComponent;
  @ViewChild('excelModal', {static: true}) excelModal!: PoModalComponent;
  @ViewChild('importInfoModal', {static: true}) importInfoModal!: PoModalComponent;

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
    private importsService: ImportsService
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
}
