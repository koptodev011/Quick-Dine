import { Routes } from "@angular/router";
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { HomeComponent } from "./features/home/home.component";
import { UsersComponent } from "./features/super-admin/users/users.component";
import { RolesComponent } from "./features/super-admin/roles/roles.component";
import { RestaurantsComponent } from "./features/super-admin/restaurants/restaurants.component";
import { authGuard } from "./core/guards/auth.guard";
import { EditRestaurantsComponent } from "./features/super-admin/restaurants/edit-restaurants/edit-restaurants.component";
import { PermissionsComponent } from "./features/super-admin/permissions/permissions.component";
import { EditUserComponent } from "./features/super-admin/users/edit-user/edit-user.component";

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "home", component: HomeComponent, canActivate: [authGuard] },
  { path: "restaurants", component: RestaurantsComponent, canActivate: [authGuard] },
  { path: "users", component: UsersComponent, canActivate: [authGuard] },
  { path: "roles", component: RolesComponent, canActivate: [authGuard] },
  { path: 'edit-restaurant/:id', component: EditRestaurantsComponent },
  { path: 'permissions', component: PermissionsComponent },
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [authGuard] }
];
