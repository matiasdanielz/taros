import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesBudgetItemModalComponent } from './edit-sales-budget-item-modal.component';

describe('EditSalesBudgetItemModalComponent', () => {
  let component: EditSalesBudgetItemModalComponent;
  let fixture: ComponentFixture<EditSalesBudgetItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSalesBudgetItemModalComponent]
    });
    fixture = TestBed.createComponent(EditSalesBudgetItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
