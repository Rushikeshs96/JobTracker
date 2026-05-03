import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrpesessionComponent } from './strpesession.component';

describe('StrpesessionComponent', () => {
  let component: StrpesessionComponent;
  let fixture: ComponentFixture<StrpesessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StrpesessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrpesessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
