import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesBudgetHeaderModalComponent } from './edit-sales-budget-header-modal.component';

describe('EditSalesBudgetHeaderModalComponent', () => {
  let component: EditSalesBudgetHeaderModalComponent;
  let fixture: ComponentFixture<EditSalesBudgetHeaderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSalesBudgetHeaderModalComponent]
    });
    fixture = TestBed.createComponent(EditSalesBudgetHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
