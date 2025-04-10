import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoNavbarIconAction } from '@po-ui/ng-components';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  protected navbarIconActions: PoNavbarIconAction[] = [
    {
      label: 'Sair',
      icon: 'po-icon-exit',
      tooltip: 'Sair',
      action: () => this.logoutUser()
    }
  ];

  protected navbarLogo: string = "./assets/logomarca.png";

  constructor(
    private router: Router
  ){

  }

  private logoutUser(){
    this.moveToSigninPage();
  }

  private moveToSigninPage(){
    this.router.navigate(['', 'Authentication']);
  }
}
