import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesRequestItemModalComponent } from './add-sales-request-item-modal.component';

describe('AddSalesRequestItemModalComponent', () => {
  let component: AddSalesRequestItemModalComponent;
  let fixture: ComponentFixture<AddSalesRequestItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesRequestItemModalComponent]
    });
    fixture = TestBed.createComponent(AddSalesRequestItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
