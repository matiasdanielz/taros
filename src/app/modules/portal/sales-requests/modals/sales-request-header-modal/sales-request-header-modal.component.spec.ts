import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRequestHeaderModalComponent } from './sales-request-header-modal.component';

describe('SalesRequestHeaderModalComponent', () => {
  let component: SalesRequestHeaderModalComponent;
  let fixture: ComponentFixture<SalesRequestHeaderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesRequestHeaderModalComponent]
    });
    fixture = TestBed.createComponent(SalesRequestHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
