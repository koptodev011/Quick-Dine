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
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = "";

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = "";

    if (this.loginForm.invalid) return;

    const loginData = this.loginForm.value;

    this.http
      .post<any>("http://localhost:3000/api/users/login", loginData)
      .subscribe({
        next: (res) => {
          console.log("Login successful:", res);
          localStorage.setItem("token", res.token);
          this.router.navigate(["/home"]);
        },
        error: (err: HttpErrorResponse) => {
          console.log("Login failed");
          this.errorMessage = err.error?.message || "Login failed.";
        },
      });
  }
}
