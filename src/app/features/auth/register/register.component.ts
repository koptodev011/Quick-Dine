import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from "@angular/common/http";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage = "";

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = "";

    if (this.registerForm.invalid) return;

    const registerData = this.registerForm.value;

    this.http
      .post<any>("http://localhost:3000/api/users/register", registerData)
      .subscribe({
        next: (res) => {
          console.log("Register successful:", res);
          localStorage.setItem("token", res.token); // optional
          alert("Registration successful!");
          // Optionally navigate to login or dashboard
        },
        error: (err: HttpErrorResponse) => {
          console.error("Registration failed:", err);
          this.errorMessage = err.error?.message || "Registration failed.";
        },
      });
  }
}
