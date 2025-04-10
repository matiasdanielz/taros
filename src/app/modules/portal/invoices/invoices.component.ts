import { Component, ViewChild } from '@angular/core';
import { PoButtonGroupItem, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { InvoicesService } from './invoices.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {
  @ViewChild('downloadsModal', {static: true}) downloadsModal!: PoModalComponent;

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
      label: 'Downloads',
      icon: 'po-icon-download',
      action: () => this.downloadsModal.open()
    }
  ];

  //Itens Da Tabela De Clientes
  protected invoicesColumns: PoTableColumn[] = [];
  protected invoicesItems: any[] = [];
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';

  constructor(
    private invoicesService: InvoicesService
  ){
    this.invoicesColumns = invoicesService.GetInvoicesColumns();
  }

  async ngOnInit(): Promise<void> {
    await this.LoadInvoices();
  }

  protected async LoadInvoices(){
    this.invoicesItems = await this.invoicesService.GetInvoicesItems(this.page, this.pageSize, this.filter);
  }

  protected onSearch(filter: string): any {
    this.page = -1;
    this.invoicesItems = [];
    this.filter = filter
    this.LoadInvoices()
  }

  protected onResetSearch(): any {
    this.page = -1;
    this.invoicesItems = [];
    this.filter = ''
    this.LoadInvoices()
  }
}
