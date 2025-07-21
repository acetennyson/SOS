import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawGestureComponent } from './draw-gesture.component';

describe('DrawGestureComponent', () => {
  let component: DrawGestureComponent;
  let fixture: ComponentFixture<DrawGestureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawGestureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawGestureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
