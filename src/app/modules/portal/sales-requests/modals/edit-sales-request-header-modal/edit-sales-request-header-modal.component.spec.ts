import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesRequestHeaderModalComponent } from './edit-sales-request-header-modal.component';

describe('EditSalesRequestHeaderModalComponent', () => {
  let component: EditSalesRequestHeaderModalComponent;
  let fixture: ComponentFixture<EditSalesRequestHeaderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSalesRequestHeaderModalComponent]
    });
    fixture = TestBed.createComponent(EditSalesRequestHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
