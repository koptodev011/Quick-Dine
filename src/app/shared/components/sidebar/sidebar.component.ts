import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar bg-dark text-white p-3">
      <h3 class="text-center mb-4">QuickDine</h3>
      <div class="nav flex-column">
        <a routerLink="/home" routerLinkActive="active" class="nav-link text-white mb-2">
          <i class="bi bi-house-door me-2"></i> Dashboard
        </a>
        <a routerLink="/users" routerLinkActive="active" class="nav-link text-white mb-2">
          <i class="bi bi-list me-2"></i> Users
        </a>
        <a routerLink="/roles" routerLinkActive="active" class="nav-link text-white mb-2">
          <i class="bi bi-bag me-2"></i> Roles
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="nav-link text-white mb-2">
          <i class="bi bi-gear me-2"></i> Settings
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
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
