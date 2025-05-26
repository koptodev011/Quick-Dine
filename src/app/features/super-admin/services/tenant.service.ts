import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tenant {
  id?: string;
  name: string;
  domain: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Get all tenants
  getTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.apiUrl}/tenants`);
  }


  // Get single tenant by ID
  getTenantById(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/tenants/${id}`);
  }


  // Add new tenant
  addTenant(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.apiUrl}/tenants`, tenantData);
  }

  // Update existing tenant
  updateTenant(id: string, tenantData: Partial<Tenant>): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/tenants/${id}`, tenantData);
  }

  // Delete tenant
  deleteTenant(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tenants/${id}`);
  }

  // Toggle tenant active status
  toggleTenantStatus(id: string, isActive: boolean): Observable<Tenant> {
    return this.http.patch<Tenant>(`${this.apiUrl}/tenants/${id}/status`, { isActive });
  }
}
