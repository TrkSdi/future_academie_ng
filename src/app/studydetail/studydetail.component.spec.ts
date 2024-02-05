import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudydetailComponent } from './studydetail.component';

describe('StudydetailComponent', () => {
  let component: StudydetailComponent;
  let fixture: ComponentFixture<StudydetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudydetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
