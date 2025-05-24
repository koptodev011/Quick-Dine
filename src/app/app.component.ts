import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-container">
      <app-sidebar *ngIf="!isAuthPage()"></app-sidebar>
      <div class="content-area" [class.with-sidebar]="!isAuthPage()">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
    }
    .content-area {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
    .content-area.with-sidebar {
      margin-left: 250px;
    }
  `]
})
export class AppComponent {
  constructor(private router: Router) {}

  isAuthPage(): boolean {
    const currentPath = this.router.url;
    return currentPath.includes('/login') || currentPath.includes('/register');
  }
}
