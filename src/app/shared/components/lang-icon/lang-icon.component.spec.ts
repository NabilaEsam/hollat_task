import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangIconComponent } from './lang-icon.component';

describe('LangIconComponent', () => {
  let component: LangIconComponent;
  let fixture: ComponentFixture<LangIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LangIconComponent]
    });
    fixture = TestBed.createComponent(LangIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
