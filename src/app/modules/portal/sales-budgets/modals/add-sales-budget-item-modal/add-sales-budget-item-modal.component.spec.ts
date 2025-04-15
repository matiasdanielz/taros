import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesBudgetItemModalComponent } from './add-sales-budget-item-modal.component';

describe('AddSalesBudgetItemModalComponent', () => {
  let component: AddSalesBudgetItemModalComponent;
  let fixture: ComponentFixture<AddSalesBudgetItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesBudgetItemModalComponent]
    });
    fixture = TestBed.createComponent(AddSalesBudgetItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
