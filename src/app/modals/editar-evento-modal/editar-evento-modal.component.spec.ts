import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEventoModalComponent } from './editar-evento-modal.component';

describe('EditarEventoModalComponent', () => {
  let component: EditarEventoModalComponent;
  let fixture: ComponentFixture<EditarEventoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarEventoModalComponent]
    });
    fixture = TestBed.createComponent(EditarEventoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
