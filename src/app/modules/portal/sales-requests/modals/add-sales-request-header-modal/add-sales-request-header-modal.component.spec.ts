import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesRequestHeaderModalComponent } from './add-sales-request-header-modal.component';

describe('AddSalesRequestHeaderModalComponent', () => {
  let component: AddSalesRequestHeaderModalComponent;
  let fixture: ComponentFixture<AddSalesRequestHeaderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesRequestHeaderModalComponent]
    });
    fixture = TestBed.createComponent(AddSalesRequestHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
