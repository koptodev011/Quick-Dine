import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestaurantsComponent } from './edit-restaurants.component';

describe('EditRestaurantsComponent', () => {
  let component: EditRestaurantsComponent;
  let fixture: ComponentFixture<EditRestaurantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRestaurantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
