import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBudgetItemModalComponent } from './sales-budget-item-modal.component';

describe('SalesBudgetItemModalComponent', () => {
  let component: SalesBudgetItemModalComponent;
  let fixture: ComponentFixture<SalesBudgetItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesBudgetItemModalComponent]
    });
    fixture = TestBed.createComponent(SalesBudgetItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
