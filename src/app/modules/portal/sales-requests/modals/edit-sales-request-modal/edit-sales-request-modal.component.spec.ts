import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesRequestModalComponent } from './edit-sales-request-modal.component';

describe('EditSalesRequestModalComponent', () => {
  let component: EditSalesRequestModalComponent;
  let fixture: ComponentFixture<EditSalesRequestModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSalesRequestModalComponent]
    });
    fixture = TestBed.createComponent(EditSalesRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
