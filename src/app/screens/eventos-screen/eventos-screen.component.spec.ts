import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosScreenComponent } from './eventos-screen.component';

describe('EventosScreenComponent', () => {
  let component: EventosScreenComponent;
  let fixture: ComponentFixture<EventosScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventosScreenComponent]
    });
    fixture = TestBed.createComponent(EventosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
