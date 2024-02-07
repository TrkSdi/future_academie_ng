import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFavoritesComponent } from './shared-favorites.component';

describe('SharedFavoritesComponent', () => {
  let component: SharedFavoritesComponent;
  let fixture: ComponentFixture<SharedFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFavoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
