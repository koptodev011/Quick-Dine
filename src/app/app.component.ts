import { CommonModule } from "@angular/common";
import { Component, computed, effect, signal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {}
