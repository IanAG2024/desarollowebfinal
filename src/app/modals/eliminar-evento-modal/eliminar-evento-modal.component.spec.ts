import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarEventoModalComponent } from './eliminar-evento-modal.component';

describe('EliminarEventoModalComponent', () => {
  let component: EliminarEventoModalComponent;
  let fixture: ComponentFixture<EliminarEventoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarEventoModalComponent]
    });
    fixture = TestBed.createComponent(EliminarEventoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
