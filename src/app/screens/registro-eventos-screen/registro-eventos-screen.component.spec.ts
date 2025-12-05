import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEventosScreenComponent } from './registro-eventos-screen.component';

describe('RegistroEventosScreenComponent', () => {
  let component: RegistroEventosScreenComponent;
  let fixture: ComponentFixture<RegistroEventosScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroEventosScreenComponent]
    });
    fixture = TestBed.createComponent(RegistroEventosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
