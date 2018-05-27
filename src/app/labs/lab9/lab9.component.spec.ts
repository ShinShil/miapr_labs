import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab9Component } from './lab9.component';

describe('Lab9Component', () => {
  let component: Lab9Component;
  let fixture: ComponentFixture<Lab9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Lab9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Lab9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
