import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestaurantsService, Restaurant, ApiResponse } from './restaurants.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  restaurantForm: FormGroup;
  loading = false;
  submitting = false;
  showAddForm = false;
  previewUrl: string | null = null;
  listErrorMessage = '';
  addErrorMessage = '';
  addSuccessMessage = '';
  editingRestaurantId: string | null = null;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantsService: RestaurantsService
  ) {
    // Restaurant form
    this.restaurantForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      website: ['', [Validators.required]],
      gst: ['', [Validators.required]],
      image: [null]
    });


  }

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.loading = true;
    this.restaurantsService.getRestaurants().subscribe(
      (restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
        this.loading = false;
      },
      (error: Error) => {
        console.error('Error loading restaurants:', error);
        this.listErrorMessage = error.message || 'Failed to load restaurants';
        this.loading = false;
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.restaurantForm.patchValue({ image: file });

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm(): void {
    this.restaurantForm.reset();
    this.previewUrl = null;
    this.addErrorMessage = '';
    this.addSuccessMessage = '';
    this.showAddForm = false;
    this.isEditing = false;
    this.editingRestaurantId = null;
  }

  editRestaurant(restaurant: Restaurant): void {
    const id = restaurant.id?.toString() ?? null;
    this.editingRestaurantId = id;
    this.isEditing = true;
    this.showAddForm = true;

    // Set form values
    this.restaurantForm.patchValue({
      name: restaurant.name,
      website: restaurant.website || null,
      gst: restaurant.gst
    });

    // Set image preview if exists
    if (restaurant.image) {
      this.previewUrl = 'http://localhost:3000/' + restaurant.image;
    }
  }









  onSubmit(): void {
    console.log('Form Values:', this.restaurantForm.value);
    console.log('Form Valid:', this.restaurantForm.valid);
    
    if (this.restaurantForm.valid) {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
        this.addErrorMessage = 'Please login to add a restaurant';
        return;
      }

      this.submitting = true;
      this.addErrorMessage = '';
      this.addSuccessMessage = '';

      try {
        const formData = new FormData();
        const name = this.restaurantForm.get('name')?.value;
        const website = this.restaurantForm.get('website')?.value;
        const gst = this.restaurantForm.get('gst')?.value;
        
        if (!name || !website || !gst) {
          throw new Error('Required fields are missing');
        }

        // Convert form data to match API requirements
        const restaurantData = {
          name,
          website,
          gst,
          active: true
        };

        // Convert to FormData
        Object.entries(restaurantData).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
        
        const imageFile = this.restaurantForm.get('image')?.value;
        if (imageFile) {
          formData.append('image', imageFile);
        }

        // Log form data entries
        formData.forEach((value, key) => {
          console.log(`Form Data - ${key}:`, value);
        });

        console.log('Submitting form data...');
        
        const request = this.isEditing && this.editingRestaurantId ?
          this.restaurantsService.updateRestaurant(this.editingRestaurantId, formData) :
          this.restaurantsService.addRestaurant(formData);

        request.subscribe({
          next: (response: any) => {
            if (response && response.success) {
              this.addSuccessMessage = response.message || 
                (this.isEditing ? 'Restaurant updated successfully!' : 'Restaurant added successfully!');
              this.loadRestaurants();
              this.resetForm();
            } else {
              this.addErrorMessage = response.message || 'Operation failed. Please try again.';
            }
          },
          error: (error) => {
            console.error('Component Error Handler:', error);
            
            // Handle different error scenarios
            if (error.status === 500) {
              this.addErrorMessage = 'Server error occurred. Please try again.';
            } else if (error.status === 401) {
              this.addErrorMessage = 'Authentication failed. Please log in again.';
            } else if (error.status === 403) {
              this.addErrorMessage = 'You do not have permission to perform this action.';
            } else if (error.status === 400) {
              this.addErrorMessage = 'Invalid data provided. Please check your inputs.';
            } else {
              this.addErrorMessage = error.message || 'Operation failed. Please try again.';
            }

            // Log additional error details
            console.error('Error Details:', {
              status: error.status,
              message: this.addErrorMessage,
              error: error.error
            });
          },
          complete: () => {
            this.submitting = false;
          }
        });
      } catch (error: any) {
        this.addErrorMessage = error.message;
        this.submitting = false;
      }
    } else {
      this.addErrorMessage = 'Please fill in all required fields';
    }
  }
}
