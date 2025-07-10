import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRequestItemModalComponent } from './sales-request-item-modal.component';

describe('SalesRequestItemModalComponent', () => {
  let component: SalesRequestItemModalComponent;
  let fixture: ComponentFixture<SalesRequestItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesRequestItemModalComponent]
    });
    fixture = TestBed.createComponent(SalesRequestItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
