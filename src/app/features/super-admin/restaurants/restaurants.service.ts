import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

export interface RestaurantMeta {
  address: string;
  phone: string;
  email: string;
  features?: string[];
  openingHours?: OpeningHours;
}

export interface TenantUnit {
  id?: number;
  name: string;
  floor: number;
  unitNumber: string;
  capacity: number;
  tenantId: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Restaurant {
  id?: number;
  name: string;
  website?: string | null;
  gst: string;
  image?: string | null;
  meta?: any | null;
  created_at?: string;
  updated_at?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Server is not responding. Please try again later.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (typeof error.error === 'string') {
        try {
          const parsedError = JSON.parse(error.error);
          errorMessage = parsedError.message || 'Server error. Please try again.';
        } catch {
          errorMessage = 'Server error. Please try again.';
        }
      } else {
        errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Get all restaurants
  getRestaurants(): Observable<Restaurant[]> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/getalltenants`, { headers })
      .pipe(
        map(response => {
          console.log('Raw API Response:', response);
          if (response && Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        }),
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }



  // Add new restaurant
  addRestaurant(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Log the token being used
    console.log('Using token:', token);

    // Create headers with Authorization
    let headers = new HttpHeaders();
    if (token) {
      headers = headers
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
    } else {
      throw new Error('No authentication token found');
    }

    // Log the complete request details
    console.log('Request URL:', `${this.apiUrl}/addtenants`);
    console.log('Request Headers:', headers);
    
    // Log FormData contents
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Log the final request configuration
    console.log('Final request config:', {
      url: `${this.apiUrl}/addtenants`,
      headers: headers.keys().reduce((obj, key) => {
        obj[key] = headers.get(key);
        return obj;
      }, {} as any),
      formData: Array.from(formData.entries())
    });

    return this.http.post(`${this.apiUrl}/addtenants`, formData, { 
      headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        console.log('Response:', {
          status: response.status,
          statusText: response.statusText,
          body: response.body,
          headers: response.headers.keys().reduce((obj, key) => {
            obj[key] = response.headers.get(key);
            return obj;
          }, {} as any)
        });
        return response.body;
      }),
      catchError(error => {
        // Log the complete error object
        console.error('Error object:', error);

        // Log specific error details
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          error: error.error
        });

        if (error.status === 500) {
          throw new Error('Server error occurred. Please try again.');
        }
        throw error;
      })
    );
  }

  // Update restaurant
  updateRestaurant(id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Create headers with Authorization
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    // Validate ID
    if (!id) {
      throw new Error('Restaurant ID is required for update');
    }

    // Log request details
    console.log('Update Request Details:', {
      url: `${this.apiUrl}/updatetenant/${id}`,
      headers: headers.keys().reduce((obj, key) => {
        obj[key] = headers.get(key);
        return obj;
      }, {} as any),
      method: 'PUT'
    });
    
    // Log FormData contents
    console.log('Update FormData contents:');
    const formDataObj: any = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value instanceof File ? `File: ${value.name}` : value;
      console.log(`${key}:`, formDataObj[key]);
    });
    console.log('FormData as object:', formDataObj);

    return this.http.put(`${this.apiUrl}/updatetenant/${id}`, formData, { 
      headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        console.log('Update Response:', {
          status: response.status,
          statusText: response.statusText,
          body: response.body,
          headers: response.headers.keys().reduce((obj, key) => {
            obj[key] = response.headers.get(key);
            return obj;
          }, {} as any)
        });
        return response.body;
      }),
      catchError(error => {
        // Enhanced error logging
        const errorDetails = {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          error: error.error,
          rawError: error,
          requestData: {
            url: `${this.apiUrl}/updatetenant/${id}`,
            formData: formDataObj,
            headers: headers.keys().reduce((obj, key) => {
              obj[key] = headers.get(key);
              return obj;
            }, {} as any)
          }
        };
        console.error('Update Error Details:', errorDetails);

        // Handle specific error cases
        if (error.status === 500) {
          console.error('Server Error Stack:', error.error?.stack || 'No stack trace available');
          throw new Error(`Server error occurred: ${error.error?.message || 'Unknown error'}`);
        } else if (error.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (error.status === 403) {
          throw new Error('You do not have permission to update this restaurant.');
        } else if (error.status === 404) {
          throw new Error('Restaurant not found.');
        } else if (error.status === 400) {
          throw new Error(`Invalid request: ${error.error?.message || 'Please check your input'}`);
        }
        
        // If we get here, it's an unhandled error type
        throw new Error(`Update failed: ${error.error?.message || error.message || 'Unknown error'}`);
      })
    );
  }

  // Get restaurant by ID
  getRestaurantById(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/gettenant/${id}`, { headers })
      .pipe(
        map(response => {
          console.log('Get restaurant response:', response);
          return response;
        }),
        catchError(error => {
          console.error('Error getting restaurant:', error);
          throw error;
        })
      );
  }



  // Delete restaurant (soft delete)
  // Get restaurant meta
  getRestaurantMeta(id: string): Observable<ApiResponse<RestaurantMeta>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<RestaurantMeta>>(`${this.apiUrl}/restaurant/${id}/meta`, { headers })
      .pipe(
        map(response => {
          console.log('Get Meta Response:', response);
          return response;
        }),
        catchError(error => {
          console.error('Get Meta Error:', error);
          throw new Error(error.error?.message || 'Failed to get restaurant details');
        })
      );
  }

  // Update restaurant meta
  updateRestaurantMeta(id: string, metaData: RestaurantMeta): Observable<ApiResponse<RestaurantMeta>> {
    const headers = this.getHeaders();
    return this.http.put<ApiResponse<RestaurantMeta>>(`${this.apiUrl}/restaurant/${id}/meta`, metaData, { headers })
      .pipe(
        map(response => {
          console.log('Update Meta Response:', response);
          return response;
        }),
        catchError(error => {
          console.error('Update Meta Error:', error);
          throw new Error(error.error?.message || 'Failed to update restaurant details');
        })
      );
  }

  // Add tenant unit
  addTenantUnit(unitData: TenantUnit): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/tenantunit`, unitData, { headers })
      .pipe(
        map(response => {
          console.log('Add Unit Response:', response);
          return response;
        }),
        catchError(error => {
          console.error('Add Unit Error:', error);
          throw new Error(error.error?.message || 'Failed to add tenant unit');
        })
      );
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tenants/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Toggle restaurant active status
  toggleRestaurantStatus(id: number, active: boolean): Observable<Restaurant> {
    return this.http.patch<Restaurant>(`${this.apiUrl}/tenants/${id}`, { active }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


}
