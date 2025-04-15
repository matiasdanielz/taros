import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesRequestItemModalComponent } from './edit-sales-request-item-modal.component';

describe('EditSalesRequestItemModalComponent', () => {
  let component: EditSalesRequestItemModalComponent;
  let fixture: ComponentFixture<EditSalesRequestItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSalesRequestItemModalComponent]
    });
    fixture = TestBed.createComponent(EditSalesRequestItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
