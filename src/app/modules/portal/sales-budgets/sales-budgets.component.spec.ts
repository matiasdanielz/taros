import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBudgetsComponent } from './sales-budgets.component';

describe('SalesBudgetsComponent', () => {
  let component: SalesBudgetsComponent;
  let fixture: ComponentFixture<SalesBudgetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesBudgetsComponent]
    });
    fixture = TestBed.createComponent(SalesBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
