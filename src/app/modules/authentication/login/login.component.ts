import { Component, ViewChild } from '@angular/core';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('forgotPassword', {static: true}) forgotPassword!: ForgotPasswordComponent;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService,
    private poNotification: PoNotificationService
  ){

  }

  protected recoveryPassword(){
    this.forgotPassword.openModal();
  }

  protected async CheckLogin(formData: any) {
    const requestJson = {
      "user": formData['login'],
      "password": formData['password']
    };

    const response: any = await this.loginService.DoLogin(requestJson);

    if (response['isLogged'] === true) {
      localStorage.setItem('salesmanId', response['sessionInfo']['userId']);

      setTimeout(() => {
        this.router.navigate(['/Portal']);
      }, 100); // pequena espera
    }else{
      this.poNotification.error("Usuario ou senha incorretos");
    }
  }
}
