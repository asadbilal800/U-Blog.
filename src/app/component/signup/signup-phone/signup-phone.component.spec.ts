import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPhoneComponent } from './signup-phone.component';

describe('SignupPhoneComponent', () => {
  let component: SignupPhoneComponent;
  let fixture: ComponentFixture<SignupPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupPhoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
