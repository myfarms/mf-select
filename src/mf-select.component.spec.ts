import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MfSelectComponent } from './mf-select.component';

describe('MfSelectComponent', () => {

  let comp: MfSelectComponent;
  let fixture: ComponentFixture<MfSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MfSelectComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
