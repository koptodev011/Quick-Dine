import { CommonModule } from "@angular/common";
import { Component, computed, effect, signal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(private router: Router) {}

  isAuthPage(): boolean {
    const currentPath = this.router.url;
    return currentPath.includes('/login') || currentPath.includes('/register');
  }
}
