import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RolesService, Role } from '../../../core/services/roles.service';



@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  showAddForm = false;
  roles: Role[] = [];
  newRole: Role = {
    id: 0,
    name: '',
    description: '',
    createdAt: new Date()
  };

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        // TODO: Add proper error handling
      }
    });
  }

  addRole(): void {
    console.log('Form submitted with data:', this.newRole);
    if (this.newRole.name && this.newRole.description) {
      const { id, createdAt, ...roleData } = this.newRole;
      console.log('Sending to API:', roleData);
      this.rolesService.createRole(roleData).subscribe({
        next: (newRole) => {
          console.log('API Response:', newRole);
          this.roles.push(newRole);
          this.newRole = {
            id: 0,
            name: '',
            description: '',
            createdAt: new Date()
          };
          this.showAddForm = false;
        },
        error: (error) => {
          console.error('Error creating role:', error);
          console.log('Full error details:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          // TODO: Add proper error handling
        }
      });
    }
  }

  deleteRole(id: number): void {
    this.rolesService.deleteRole(id).subscribe({
      next: () => {
        this.roles = this.roles.filter(role => role.id !== id);
      },
      error: (error) => {
        console.error('Error deleting role:', error);
        // TODO: Add proper error handling
      }
    });
  }
}
