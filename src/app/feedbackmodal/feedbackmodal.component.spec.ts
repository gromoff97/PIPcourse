import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackmodalComponent } from './feedbackmodal.component';

describe('FeedbackmodalComponent', () => {
  let component: FeedbackmodalComponent;
  let fixture: ComponentFixture<FeedbackmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
