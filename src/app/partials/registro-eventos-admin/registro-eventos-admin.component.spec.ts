import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEventosAdminComponent } from './registro-eventos-admin.component';

describe('RegistroEventosAdminComponent', () => {
  let component: RegistroEventosAdminComponent;
  let fixture: ComponentFixture<RegistroEventosAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroEventosAdminComponent]
    });
    fixture = TestBed.createComponent(RegistroEventosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
