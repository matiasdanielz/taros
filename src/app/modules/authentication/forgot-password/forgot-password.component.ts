import { Component, ViewChild } from '@angular/core';
import { PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  @ViewChild('forgotPasswordModal', {static: true}) private forgotPasswordModal!: PoModalComponent;

  recoveryOption: string = 'sms';
phoneNumber: string = '';

recoveryOptions = [
  { label: 'e-mail', value: 'email' },
  { label: 'SMS', value: 'sms' }
];


public openModal(){
  this.forgotPasswordModal.open();
}


isFormValid(): boolean {
  if (this.recoveryOption === 'sms') {
    return !!this.phoneNumber && this.phoneNumber.length === 15; // Verifica se preencheu corretamente
  }
  return false;
}

sendRecovery() {
  if (this.isFormValid()) {
    // Aqui você chama o serviço de recuperação
    console.log('Enviando recuperação para:', this.phoneNumber);
  }
}

}
