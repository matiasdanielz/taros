import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBudgetHeaderModalComponent } from './sales-budget-header-modal.component';

describe('SalesBudgetHeaderModalComponent', () => {
  let component: SalesBudgetHeaderModalComponent;
  let fixture: ComponentFixture<SalesBudgetHeaderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesBudgetHeaderModalComponent]
    });
    fixture = TestBed.createComponent(SalesBudgetHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
