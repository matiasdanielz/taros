import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportsComponent } from './imports.component';

describe('ImportsComponent', () => {
  let component: ImportsComponent;
  let fixture: ComponentFixture<ImportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportsComponent]
    });
    fixture = TestBed.createComponent(ImportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
