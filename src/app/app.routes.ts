import { Routes } from "@angular/router";
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";

export const routes: Routes = [
  { path: "", component: LoginComponent }, // comma here
  { path: "register", component: RegisterComponent }, // no leading slash
];
