import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {
  @ViewChild('DeleteConfirmationModal', {static: true}) DeleteConfirmationModal!: PoModalComponent;

  @Output() onDelete = new EventEmitter<any>(); // <<< Aqui emitimos quando o item for criado
  

  public open(){
    this.DeleteConfirmationModal.open();
  }

  public close(){
    this.DeleteConfirmationModal.close();
  }

  protected ConfirmDelete(){
    this.onDelete.emit();
  }
}
