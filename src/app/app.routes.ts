import { Routes } from "@angular/router";
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { HomePageComponent } from "../home/home-page/home-page.component";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "home", component: HomePageComponent },
  // { path: "users", component: UsersComponent },
];
