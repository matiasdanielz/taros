import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesBudgetHeaderModalComponent } from './add-sales-budget-header-modal.component';

describe('AddSalesBudgetHeaderModalComponent', () => {
  let component: AddSalesBudgetHeaderModalComponent;
  let fixture: ComponentFixture<AddSalesBudgetHeaderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesBudgetHeaderModalComponent]
    });
    fixture = TestBed.createComponent(AddSalesBudgetHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
