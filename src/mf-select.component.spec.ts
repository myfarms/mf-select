import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { MfSelectComponent } from './mf-select.component';

describe('MfSelectComponent', () => {

  let comp:    MfSelectComponent;
  let fixture: ComponentFixture<MfSelectComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MfSelectComponent ], // declare the test component
    });

    fixture = TestBed.createComponent(MfSelectComponent);

    comp = fixture.componentInstance; // BannerComponent test instance

    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
  });

  it('Should be false', () => {
    expect(false).toBe(true);
  });
});
