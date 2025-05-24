import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  showAddForm = false;
  searchTerm = '';
  statusFilter = 'all';
  userForm: FormGroup;

  // Dummy data - replace with API call later
  users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@restaurant.com',
      restaurant: 'Tasty Bites',
      role: 'Admin',
      status: 'active',
      createdAt: new Date('2025-05-20')
    },
    {
      id: 2,
      name: 'Emma Wilson',
      email: 'emma@foodcourt.com',
      restaurant: 'Food Court',
      role: 'Admin',
      status: 'active',
      createdAt: new Date('2025-05-21')
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@cafe.com',
      restaurant: 'Corner Café',
      role: 'Admin',
      status: 'inactive',
      createdAt: new Date('2025-05-22')
    }
  ];

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      restaurant: ['', Validators.required],
      profilePhoto: [''],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      delete formData.confirmPassword; // Remove confirm password before saving
      
      const newUser = {
        id: this.users.length + 1,
        ...formData,
        role: 'Admin',
        status: 'active',
        createdAt: new Date(),
        profilePhotoUrl: this.previewUrl // Add the profile photo URL
      };
      
      this.users.unshift(newUser);
      this.userForm.reset();
      this.showAddForm = false;
    }
  }

  editUser(user: any) {
    // Implement edit functionality
    console.log('Edit user:', user);
  }

  deleteUser(user: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }
}
