/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustommersComponent } from './custommers.component';

describe('CustommersComponent', () => {
  let component: CustommersComponent;
  let fixture: ComponentFixture<CustommersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustommersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustommersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
