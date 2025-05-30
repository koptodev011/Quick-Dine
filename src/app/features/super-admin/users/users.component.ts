import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RolesService } from '../../../core/services/roles.service';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  roleId: number;
  isActive: boolean;
}

interface UserResponse {
  message: string;
  users: User[];
}

interface Tenant {
  id: number;
  name: string;
  website: string | null;
  gst: string;
  image: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  Math = Math; // For template usage
  showAddForm = false;
  roles: any[] = [];
  roleError: string = '';
  tenants: Tenant[] = [];
  tenantError: string = '';
  searchTerm = '';
  statusFilter = 'all';
  userForm: FormGroup;
  branches: { id: number; value: string }[] = [];

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  private _allUsers: User[] = [];
  users: User[] = [];

  // Getter to filter users based on search and status
  private _filteredUsers: User[] = [];

  get filteredUsers(): User[] {
    return this._filteredUsers;
  }

  private filterUsers() {
    const filtered = this._allUsers.filter(user => {
      const matchesSearch = this.searchTerm.trim() === '' ||
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && user.isActive) ||
        (this.statusFilter === 'inactive' && !user.isActive);

      return matchesSearch && matchesStatus;
    });

    this._filteredUsers = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.updatePagedUsers();
  }

  private updatePagedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.users = this._filteredUsers.slice(startIndex, endIndex);
  }

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private rolesService: RolesService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required], // Removed minLength since API accepts 'aj'
      confirmPassword: ['', Validators.required],
      roles: ['', Validators.required],
      profilePhoto: [''],
      isActive: [true],
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
    this.loadRoles();
    this.loadTenants();
  }

  loadTenants() {
    this.http.get<{success: boolean; message: string; data: Tenant[]}>('http://localhost:3000/api/getalltenants')
      .subscribe({
        next: (response) => {
          console.log('Tenants loaded:', response);
          this.tenants = response.data;
          this.tenantError = '';
        },
        error: (error) => {
          console.error('Error loading tenants:', error);
          this.tenantError = 'Failed to load branches';
          this.tenants = [];
        }
      });
  }

  loadRoles() {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        console.log('Roles loaded:', roles);
        this.roles = roles;
        this.roleError = '';
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.roleError = 'Failed to load roles';
        this.roles = [];
      }
    });
  }

  loadUsers() {
    this.http.get<UserResponse>('http://localhost:3000/api/users/getallusers')
      .subscribe({
        next: (response) => {
          this._allUsers = response.users;
          this.filterUsers();
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        }
      });
  }

  updateFilteredUsers() {
    this.currentPage = 1;
    this.filterUsers();
  }

  // Pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedUsers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedUsers();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Watch for changes in search and filter
  onSearchChange() {
    this.updateFilteredUsers();
  }

  onStatusFilterChange() {
    this.updateFilteredUsers();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = new FormData();
      
      // Append form fields
      formData.append('name', this.userForm.get('name')?.value);
      formData.append('email', this.userForm.get('email')?.value);
      formData.append('phone', this.userForm.get('phone')?.value);
      formData.append('password', this.userForm.get('password')?.value);
      
      // Append tenant IDs for branches
      this.branches.forEach((branch, index) => {
        if (branch.value) {
          formData.append(`tenant_id${index}`, branch.value);
        }
      });

      // Append profile photo if selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // Make API call
      this.http.post('http://localhost:3000/api/users/register', formData)
        .subscribe({
          next: (response: any) => {
            console.log('User registered successfully:', response);
            this.userForm.reset();
            this.branches = [];
            this.showAddForm = false;
            this.selectedFile = null;
            this.previewUrl = null;
            this.loadUsers(); // Reload users after submission
          },
          error: (error) => {
            console.error('Error registering user:', error);
          }
        });
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
    console.log('Current branches:', this.branches);
  }

  removeBranch(index: number) {
    if (this.branches.length > 1) {
      this.branches = this.branches.filter((_, i) => i !== index);
    }
  }
}
