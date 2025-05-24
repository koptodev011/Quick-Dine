import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Welcome Section -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="mb-0">Dashboard</h1>
          <p class="text-muted">Welcome back, Admin!</p>
        </div>
        <button class="btn btn-primary">
          <i class="bi bi-plus-lg me-2"></i>New Order
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-12 col-md-6 col-lg-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="rounded-circle bg-primary bg-opacity-10 p-3">
                  <i class="bi bi-cart text-primary fs-4"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle mb-1 text-muted">Total Orders</h6>
                  <h2 class="card-title mb-0">150</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="rounded-circle bg-success bg-opacity-10 p-3">
                  <i class="bi bi-currency-dollar text-success fs-4"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle mb-1 text-muted">Revenue</h6>
                  <h2 class="card-title mb-0">$2,150</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="rounded-circle bg-warning bg-opacity-10 p-3">
                  <i class="bi bi-people text-warning fs-4"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle mb-1 text-muted">Customers</h6>
                  <h2 class="card-title mb-0">85</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="rounded-circle bg-info bg-opacity-10 p-3">
                  <i class="bi bi-star text-info fs-4"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle mb-1 text-muted">Rating</h6>
                  <h2 class="card-title mb-0">4.8</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="row">
        <div class="col-12 col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3">
              <h5 class="card-title mb-0">Recent Orders</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Order ID</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Items</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#ORD-001</td>
                      <td>John Doe</td>
                      <td>3 items</td>
                      <td>$45.00</td>
                      <td><span class="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#ORD-002</td>
                      <td>Jane Smith</td>
                      <td>2 items</td>
                      <td>$32.50</td>
                      <td><span class="badge bg-warning">Pending</span></td>
                    </tr>
                    <tr>
                      <td>#ORD-003</td>
                      <td>Mike Johnson</td>
                      <td>4 items</td>
                      <td>$78.00</td>
                      <td><span class="badge bg-primary">Processing</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-12 col-lg-4 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3">
              <h5 class="card-title mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary">
                  <i class="bi bi-plus-circle me-2"></i>Add New Menu Item
                </button>
                <button class="btn btn-outline-success">
                  <i class="bi bi-table me-2"></i>Manage Tables
                </button>
                <button class="btn btn-outline-info">
                  <i class="bi bi-graph-up me-2"></i>View Reports
                </button>
                <button class="btn btn-outline-warning">
                  <i class="bi bi-gear me-2"></i>Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class HomeComponent {}
