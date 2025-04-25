import { Component, ViewChild } from '@angular/core';
import { PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  @ViewChild('forgotPasswordModal', { static: true }) private forgotPasswordModal!: PoModalComponent;
  
  public email: string = '';
  
  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private poNotification: PoNotificationService
  ){

  }

  public openModal() {
    this.forgotPasswordModal.open();
  }

  protected async sendPasswordRecovery(){
    const requestJson = {
      "vendedor": this.email
    };

    const response: any = await this.forgotPasswordService.SendPasswordRecovery(requestJson);
  
    if(response['codigo'] == "400"){
      this.poNotification.error(response['mensagem']);
    }else{
      this.poNotification.success(response['mensagem']);
    }
  }

}
