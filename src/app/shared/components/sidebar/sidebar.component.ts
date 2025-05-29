import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar bg-dark text-white p-3">
      <h3 class="text-center mb-4">QuickDine</h3>
      <div class="nav flex-column">
        <a routerLink="/home" class="nav-link text-white mb-2" routerLinkActive="active">
          <i class="bi bi-house-door me-2"></i> Dashboard
        </a>
        <a routerLink="/users" class="nav-link text-white mb-2" routerLinkActive="active">
          <i class="bi bi-people me-2"></i> Users
        </a>
        <a routerLink="/restaurants" class="nav-link text-white mb-2" routerLinkActive="active">
          <i class="bi bi-shop me-2"></i> Restaurants
        </a>
        <a routerLink="/roles" class="nav-link text-white mb-2" routerLinkActive="active">
          <i class="bi bi-shield-check me-2"></i> Roles
        </a>
      </div>
      <div class="mt-auto">
        <button class="btn btn-outline-light w-100" (click)="logout()">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      height: 100vh;
      width: 250px;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
    }
    .active {
      background-color: rgba(255,255,255,0.1);
      border-radius: 4px;
    }
    .nav-link:hover {
      background-color: rgba(255,255,255,0.05);
      border-radius: 4px;
    }
  `]
})
export class SidebarComponent {
  constructor(private router: Router) {}

  navigate(path: string) {
    console.log('Navigating to:', path);
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
