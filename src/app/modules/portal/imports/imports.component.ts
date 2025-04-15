import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { ImportsService } from './imports.service';

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.css']
})
export class ImportsComponent implements OnInit{
  @ViewChild('ediModal', {static: true}) ediModal!: PoModalComponent;
  @ViewChild('excelModal', {static: true}) excelModal!: PoModalComponent;

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

  protected tableHeight: number = window.innerHeight / 1.5;
  protected importsColumns: PoTableColumn[] = [];
  protected importsItems: any[] = [];

  constructor(
    private importsService: ImportsService
  ){
    this.importsColumns = importsService.GetImportsColumns();
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
}
