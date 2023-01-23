import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Build8ProfileComponent } from './build8-profile.component';

describe('Build8ProfileComponent', () => {
  let component: Build8ProfileComponent;
  let fixture: ComponentFixture<Build8ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Build8ProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Build8ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
