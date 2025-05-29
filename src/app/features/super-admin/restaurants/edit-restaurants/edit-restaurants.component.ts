import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../restaurants.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-restaurants',
  templateUrl: './edit-restaurants.component.html',
  styleUrls: ['./edit-restaurants.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditRestaurantsComponent implements OnInit {
  restaurantForm: FormGroup;
  submitted = false;
  showError = false;
  restaurantId: string;
  previewUrl: string | ArrayBuffer | null = null;
  imageFile: File | null = null;
  isEditing = false;
  showInlineUnitForm = false;
  loadingCountries = false;
  tenantUnitForm: FormGroup;
  submittingUnit = false;
  countries: any[] = [];
  states: any[] = [];

  constructor(
    private restaurantsService: RestaurantsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize main restaurant form
    this.restaurantForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      image: [null]
    });

    // Initialize tenant unit form
    this.tenantUnitForm = this.formBuilder.group({
      name: ['', Validators.required],
      line_one: ['', Validators.required],
      city: ['', Validators.required],
      state_id: ['', Validators.required],
      country_id: ['', Validators.required],
      postal_code: ['', Validators.required]
    });
    // Get restaurant ID from route params
    this.restaurantId = this.route.snapshot.params['id'];
  }

  resetForm(): void {
    this.restaurantForm.reset();
    this.previewUrl = null;
  }

  onTenantUnitSubmit(): void {
    if (this.tenantUnitForm.valid && !this.submittingUnit) {
      // Implementation will be added later
    }
  }

  onTenantUnitImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Implementation will be added later
    }
  }

  loadCountries(): void {
    this.loadingCountries = true;
    this.restaurantsService.getCountries().subscribe({
      next: (countries: any[]) => {
        console.log('Countries fetched:', countries);
        this.countries = countries;
        this.loadingCountries = false;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.countries = [];
        this.loadingCountries = false;
      }
    });
  }
  
  

  onCountryChange(event: any): void {
    const countryId = event.target.value;
    if (countryId) {
      // Load states for selected country
      this.restaurantsService.getStates(countryId).subscribe({
        next: (states: any[]) => {
          this.states = states;
        },
        error: (error) => {
          console.error('Error loading states:', error);
          this.states = [];
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.restaurantId) {
      this.restaurantsService.getRestaurantById(this.restaurantId).subscribe(data => {
        this.restaurantForm.patchValue({
          name: data.name,
          address: data.address,
        });
        this.previewUrl = data.imageUrl;
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
      this.restaurantForm.patchValue({ image: file });
    }
  }

  get f() {
    return this.restaurantForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.showError = false;

    if (this.restaurantForm.invalid) {
      this.showError = true;
      return;
    }

    const formData = new FormData();
    formData.append('name', this.restaurantForm.value.name);
    formData.append('address', this.restaurantForm.value.address);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.restaurantsService.updateRestaurant(this.restaurantId, formData).subscribe({
      next: (response: { success: boolean; message?: string }) => {
        this.router.navigate(['/restaurants']);
      },
      error: (error: any) => {
        console.error('Error updating restaurant', error);
      }
    });
  }
}
