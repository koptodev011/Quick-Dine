import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  roleId: number;
}

interface UserResponse {
  message: string;
  users: User[];
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  showAddForm = false;
  searchTerm = '';
  statusFilter = 'all';
  userForm: FormGroup;
  branches: { id: number; value: string }[] = [];

  users: User[] = [];

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      roles: ['', Validators.required],
      profilePhoto: [''],
      isActive: [true],
      branches: this.fb.array([]),
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

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<UserResponse>('http://localhost:3000/api/users/getallusers')
      .subscribe({
        next: (response) => {
          this.users = response.users;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        }
      });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      delete formData.confirmPassword;
      
      // TODO: Implement API call to create user
      this.userForm.reset();
      this.branches = [];
      this.showAddForm = false;
      this.loadUsers(); // Reload users after submission
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

  addBranch() {
    if (this.branches.length === 0) {
      this.branches.push({ id: 1, value: '' });
    } else {
      const newId = this.branches[this.branches.length - 1].id + 1;
      this.branches.push({ id: newId, value: '' });
    }
  }

  removeBranch(index: number) {
    if (this.branches.length > 1) {
      this.branches = this.branches.filter((_, i) => i !== index);
    }
  }
}
