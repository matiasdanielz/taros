import { Component } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { MenubarService } from './menubar.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent {
  protected menubarItems: PoMenuItem[] = [];

  constructor(
    private menubarService: MenubarService
  ){
    this.menubarItems = menubarService.getMenubarItems();
  }
}
