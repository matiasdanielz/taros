import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultOfTaxesComponent } from './result-of-taxes.component';

describe('ResultOfTaxesComponent', () => {
  let component: ResultOfTaxesComponent;
  let fixture: ComponentFixture<ResultOfTaxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultOfTaxesComponent]
    });
    fixture = TestBed.createComponent(ResultOfTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
