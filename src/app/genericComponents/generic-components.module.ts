import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { PoComponentsModule } from '@po-ui/ng-components';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';

@NgModule({
  declarations: [
    LoadingOverlayComponent,
    DeleteConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    PoTemplatesModule,
    PoComponentsModule
  ],
  exports: [
    LoadingOverlayComponent,
    DeleteConfirmationModalComponent
  ]
})
export class GenericComponentsModule { }
