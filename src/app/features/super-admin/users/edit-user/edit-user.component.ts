import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userId!: number;
  user: any;
  userForm: FormGroup;
  previewUrl: string | null = null;
  roles: any[] = [];
  tenants: any[] = [];
  branches: { value: string }[] = [];
  roleError: string | null = null;
  tenantError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
      roles: ['', Validators.required],
      isActive: [true],
      profilePhoto: [null]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
    this.loadRoles();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUser() {
    this.http.get(`http://localhost:3000/api/users/getusertenants/${this.userId}`).subscribe({
      next: (response: any) => {
        this.user = response.user;
        this.tenants = response.tenants;
        
        this.userForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone
        });

        if (this.user.profilePhoto) {
          this.previewUrl = this.user.profilePhoto;
        }

        // If there are tenants, create branch entries for them
        if (this.tenants && this.tenants.length > 0) {
          this.branches = this.tenants.map(tenant => ({ value: tenant.id.toString() }));
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

  loadRoles() {
    this.http.get('http://localhost:3000/api/roles').subscribe({
      next: (response: any) => {
        this.roles = response.roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  loadTenants() {
    // This method is now handled in loadUser()
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addBranch() {
    this.branches.push({ value: '' });
  }

  removeBranch(index: number) {
    this.branches.splice(index, 1);
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = new FormData();
      const formValue = this.userForm.value;
      
      Object.keys(formValue).forEach(key => {
        if (key !== 'profilePhoto') {
          formData.append(key, formValue[key]);
        }
      });

      if (this.userForm.get('profilePhoto')?.value) {
        formData.append('profilePhoto', this.userForm.get('profilePhoto')?.value);
      }

      formData.append('branches', JSON.stringify(this.branches.map(b => b.value).filter(v => v)));

      this.http.put(`http://localhost:3000/api/users/${this.userId}`, formData)
        .subscribe({
          next: (response: any) => {
            console.log('User updated successfully:', response);
            this.router.navigate(['/users']);
          },
          error: (error) => {
            console.error('Error updating user:', error);
            if (error.error?.roleError) {
              this.roleError = error.error.roleError;
            }
            if (error.error?.tenantError) {
              this.tenantError = error.error.tenantError;
            }
          }
        });
    }
  }

  goBack() {
    this.router.navigate(['/users']);
  }
}
