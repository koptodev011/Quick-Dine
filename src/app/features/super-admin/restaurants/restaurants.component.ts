import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestaurantsService, Restaurant, ApiResponse, TenantUnit, RestaurantMeta, Country, State } from './restaurants.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  countries: Country[] = [];
  states: State[] = [];
  
  loadingCountries = false;
  loadingStates = false;
  countryError = '';
  stateError = '';
  showInlineUnitForm = false;
  // Restaurant Meta Form
  restaurantMetaForm: FormGroup;
  showRestaurantMeta = false;
  submittingMeta = false;
  restaurantMetaErrorMessage = '';
  
  // Restaurant Features
  availableFeatures = [
    { value: 'parking', label: 'Parking Available' },
    { value: 'wifi', label: 'Free WiFi' },
    { value: 'delivery', label: 'Delivery Service' },
    { value: 'takeaway', label: 'Takeaway Available' },
    { value: 'outdoor', label: 'Outdoor Seating' },
    { value: 'reservation', label: 'Reservations' }
  ];

  // Week Days
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  // Tenant Unit Form
  tenantUnitForm: FormGroup;
  showTenantUnit = false;
  submittingUnit = false;
  tenantUnitErrorMessage = '';
  restaurants: Restaurant[] = [];
  restaurantForm: FormGroup;
  loading = false;
  submitting = false;
  showAddForm = false;
  previewUrl: string | null = null;
  tenantUnitPreviewUrl: string | null = null;
  listErrorMessage = '';
  addErrorMessage = '';
  addSuccessMessage = '';
  editingRestaurantId: string | null = null;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantsService: RestaurantsService,
    private router: Router
  ) {
    // Initialize restaurant meta form
    this.restaurantMetaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      features: [[]],
      openingHours: this.formBuilder.group(
        this.weekDays.reduce((acc, day) => ({
          ...acc,
          [day + '_open']: [''],
          [day + '_close']: ['']
        }), {})
      )
    });
    // Initialize tenant unit form
    this.tenantUnitForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      tenant_id: [''],
      line_one: ['', [Validators.required]],
      line_two: [''],
      line_three: [''],
      landmark: [''],
      city: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      altitude: [''],
      state_id: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      image: [null],
      active: [true],
      default: [false],
      meta: [''],
      deleted_at: [null]
    });
    // Restaurant form
    this.restaurantForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      website: ['', [Validators.required]],
      gst: ['', [Validators.required]],
      image: [null],
      active: [true]
    });


  }

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadCountries();

    // Subscribe to country_id changes
    this.tenantUnitForm.get('country_id')?.valueChanges.subscribe(countryId => {
      if (countryId) {
        this.onCountryChange(countryId);
      } else {
        this.states = [];
      }
    });
  }

 
  onTenantUnitImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tenantUnitForm.patchValue({
          image: file
        });
        this.tenantUnitPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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

  // Restaurant Meta Methods
  showRestaurantMetaForm(): void {
    if (!this.editingRestaurantId) {
      this.addErrorMessage = 'No restaurant selected for editing details';
      return;
    }
    this.showRestaurantMeta = true;

    // Load existing meta data if available
    this.restaurantsService.getRestaurantMeta(this.editingRestaurantId).subscribe({
      next: (response: ApiResponse<RestaurantMeta>) => {
        if (response.data) {
          const meta = response.data;
          this.restaurantMetaForm.patchValue({
            email: meta.email,
            phone: meta.phone,
            address: meta.address
          });

          // Set features
          if (meta.features) {
            this.restaurantMetaForm.get('features')?.setValue(meta.features);
            // Check the checkboxes
            meta.features.forEach((feature: string) => {
              const checkbox = document.getElementById('feature_' + feature) as HTMLInputElement;
              if (checkbox) checkbox.checked = true;
            });
          }

          // Set opening hours if available
          if (meta.openingHours) {
            Object.keys(meta.openingHours).forEach(day => {
              const hours = meta.openingHours![day];
              this.restaurantMetaForm.get('openingHours')?.get(day + '_open')?.setValue(hours.open);
              this.restaurantMetaForm.get('openingHours')?.get(day + '_close')?.setValue(hours.close);
            });
          }
        }
      },
      error: (error: Error) => {
        console.error('Error loading restaurant meta:', error);
        this.restaurantMetaErrorMessage = 'Failed to load restaurant details';
      }
    });
  }

  closeRestaurantMetaForm(): void {
    this.showRestaurantMeta = false;
    this.restaurantMetaForm.reset();
    this.restaurantMetaErrorMessage = '';
  }

  onFeatureChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const features = this.restaurantMetaForm.get('features')?.value || [];
    
    if (checkbox.checked) {
      features.push(checkbox.value);
    } else {
      const index = features.indexOf(checkbox.value);
      if (index > -1) features.splice(index, 1);
    }
    
    this.restaurantMetaForm.get('features')?.setValue(features);
  }

  onRestaurantMetaSubmit(): void {
    if (this.restaurantMetaForm.valid && !this.submittingMeta) {
      this.submittingMeta = true;
      this.restaurantMetaErrorMessage = '';

      const metaData = {
        ...this.restaurantMetaForm.value,
        openingHours: this.weekDays.reduce((acc, day) => {
          const open = this.restaurantMetaForm.get('openingHours')?.get(day + '_open')?.value;
          const close = this.restaurantMetaForm.get('openingHours')?.get(day + '_close')?.value;
          if (open && close) {
            acc[day] = { open, close };
          }
          return acc;
        }, {} as Record<string, { open: string; close: string }>)
      };

      this.restaurantsService.updateRestaurantMeta(this.editingRestaurantId!, metaData).subscribe({
        next: (response: ApiResponse<RestaurantMeta>) => {
          console.log('Meta updated successfully:', response);
          this.addSuccessMessage = 'Restaurant details updated successfully';
          this.closeRestaurantMetaForm();
        },
        error: (error: Error) => {
          console.error('Error updating meta:', error);
          this.restaurantMetaErrorMessage = error.message || 'Failed to update restaurant details';
          this.submittingMeta = false;
        },
        complete: () => {
          this.submittingMeta = false;
        }
      });
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



  onCountryChange(event: any): void {
    const countryId = event.target.value;
    if (countryId) {
      this.loadStates(+countryId);
    } else {
      this.states = [];
      this.tenantUnitForm.patchValue({ state_id: '' });
    }
  }
  
  // Load states from API
  loadStates(countryId: number): void {
    this.restaurantsService.getStates(countryId).subscribe({
      next: (states) => {
        this.states = states; // Now states[] is filled with ID + name
      },
      error: (error) => {
        console.error('Failed to load states:', error);
        this.states = [];
      }
    });
  }
  


  loadCountries(): void {
    this.loadingCountries = true;
    this.countryError = '';
  
    this.restaurantsService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries; // ✅ Sets the dropdown data
        this.loadingCountries = false;
      },
      error: (error) => {
        this.countryError = error.message || 'Failed to load countries';
        this.loadingCountries = false;
        console.error('Error loading countries:', error);
      }
    });
  }
  

  showTenantUnitForm(tenantId?: string | null): void {
    if (!this.editingRestaurantId) {
      this.addErrorMessage = 'No restaurant selected for adding unit';
      return;
    }
    this.showTenantUnit = true;
    this.tenantUnitForm.reset({ 
      active: true,
      tenant_id: tenantId || this.editingRestaurantId || '' // Use tenant ID if provided, otherwise use restaurant ID
    });
  }

  closeTenantUnitForm(): void {
    this.showTenantUnit = false;
    this.tenantUnitForm.reset();
  }

  onTenantUnitSubmit(): void {
    if (this.tenantUnitForm.valid && !this.submittingUnit) {
      this.submittingUnit = true;
      const formValue = this.tenantUnitForm.value;
      const data: any = {};

      // Add all form fields to data object
      if (formValue) {
        Object.keys(formValue).forEach(key => {
          if (formValue[key] !== null && formValue[key] !== undefined) {
            data[key] = formValue[key];
          }
        });
      }

      // Add the restaurant ID
      if (this.editingRestaurantId) {
        data.restaurant_id = this.editingRestaurantId;
        // Make sure tenant_id is set
        if (!data.tenant_id) {
          data.tenant_id = this.editingRestaurantId;
        }
      }

      // Log the data being sent
      console.log('Sending data:', data);

      this.restaurantsService.addTenantUnit(data).subscribe({
        next: (response: ApiResponse<TenantUnit>) => {
          if (response.success) {
            this.addSuccessMessage = 'Tenant unit added successfully';
            this.tenantUnitForm.reset();
            this.showTenantUnit = false;
            this.loadRestaurants();
          } else {
            this.tenantUnitErrorMessage = response.message || 'Error adding tenant unit';
          }
          this.submittingUnit = false;
        },
        error: (error: any) => {
          console.error('Error adding tenant unit:', error);
          this.tenantUnitErrorMessage = 'Error adding tenant unit';
          this.submittingUnit = false;
        }
      });
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

        // Add image if selected
        const imageFile = this.restaurantForm.get('image')?.value;
        if (imageFile instanceof File) {
          formData.append('image', imageFile);
        }

        console.log('Submitting form data...');
        
        // Determine if we're creating or updating
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
          error: (error: any) => {
            console.error('Component Error Handler:', error);
            
            // Log request context
            console.error('Request Context:', {
              isEditing: this.isEditing,
              editingRestaurantId: this.editingRestaurantId,
              formValues: this.restaurantForm.value,
              formValid: this.restaurantForm.valid,
              formErrors: this.restaurantForm.errors,
              formTouched: this.restaurantForm.touched
            });
            
            // Handle different error scenarios
            if (error.status === 500) {
              this.addErrorMessage = `Server error: ${error.error?.message || 'Please try again'}`;
              console.error('Server Error Details:', error.error);
            } else if (error.status === 401) {
              this.addErrorMessage = 'Your session has expired. Please log in again.';
              // TODO: Redirect to login or handle session expiry
            } else if (error.status === 403) {
              this.addErrorMessage = 'You do not have permission to perform this action.';
            } else if (error.status === 400) {
              this.addErrorMessage = `Invalid data: ${error.error?.message || 'Please check your inputs'}`;
              console.error('Validation Error:', error.error);
            } else if (error.status === 404) {
              this.addErrorMessage = 'Restaurant not found. It may have been deleted.';
              // Refresh the list to get updated data
              this.loadRestaurants();
            } else {
              this.addErrorMessage = error.message || 'Operation failed. Please try again.';
            }

            // Log complete error context
            console.error('Complete Error Context:', {
              status: error.status,
              message: this.addErrorMessage,
              originalError: error.error,
              requestContext: {
                operation: this.isEditing ? 'update' : 'create',
                targetId: this.editingRestaurantId,
                formData: this.restaurantForm.value
              }
            });
            
            this.submitting = false;
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



  editRestaurant(restaurant: any) {
    const restaurantId = restaurant.id;
    this.router.navigate(['/edit-restaurant', restaurantId]);
  }
}
