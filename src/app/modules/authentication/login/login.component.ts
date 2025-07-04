import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('forgotPassword', { static: true }) forgotPassword!: ForgotPasswordComponent;

  constructor(
    private router: Router,
    private poNotification: PoNotificationService,
    private authService: AuthService
  ) {}

  protected recoveryPassword(): void {
    this.forgotPassword.openModal();
  }

  protected async CheckLogin(formData: any): Promise<void> {
    const requestJson = {
      user: formData['login'],
      password: formData['password']
    };

    try {
      const response = await this.authService.DoLogin(requestJson);

      if (response?.isLogged) {
        // Sessão já é salva dentro de DoLogin, mas se quiser garantir, use:
        // this.authService.setSession(response);

        this.router.navigate(['/Portal']);
      } else {
        this.poNotification.error('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.poNotification.error('Erro ao tentar se conectar. Tente novamente.');
    }
  }
}
