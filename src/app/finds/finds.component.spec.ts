import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindsComponent } from './finds.component';

describe('FindsComponent', () => {
  let component: FindsComponent;
  let fixture: ComponentFixture<FindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
