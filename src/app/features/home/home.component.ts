import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Revenue Chart Data
  revenueChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [15500, 18200, 16800, 19900, 22500, 25200],
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  revenueChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    }
  };

  // Orders by Category Chart
  categoryChartData: ChartData<'doughnut'> = {
    labels: ['Main Course', 'Appetizers', 'Desserts', 'Beverages'],
    datasets: [{
      data: [450, 280, 180, 190],
      backgroundColor: [
        '#4e73df',
        '#1cc88a',
        '#f6c23e',
        '#36b9cc'
      ]
    }]
  };

  categoryChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { usePointStyle: true }
      }
    }
  };

  // Daily Orders Chart
  lineChartData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Orders',
      data: [85, 95, 110, 125, 140, 160, 145],
      borderColor: '#1cc88a',
      backgroundColor: 'rgba(28, 200, 138, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    }
  };

  // Popular Items Chart
  pieChartData: ChartData<'pie'> = {
    labels: ['Pizza', 'Burger', 'Pasta', 'Salad', 'Sushi'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        '#4e73df',
        '#1cc88a',
        '#f6c23e',
        '#36b9cc',
        '#e74a3b'
      ]
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { usePointStyle: true }
      }
    }
  };

  // Revenue by Category Bar Chart
  barChartData: ChartData<'bar'> = {
    labels: ['Main Course', 'Appetizers', 'Desserts', 'Beverages', 'Specials'],
    datasets: [{
      label: 'Revenue',
      data: [32500, 18200, 15400, 12800, 9600],
      backgroundColor: [
        'rgba(78, 115, 223, 0.8)',
        'rgba(28, 200, 138, 0.8)',
        'rgba(246, 194, 62, 0.8)',
        'rgba(54, 185, 204, 0.8)',
        'rgba(231, 74, 59, 0.8)'
      ],
      borderColor: [
        '#4e73df',
        '#1cc88a',
        '#f6c23e',
        '#36b9cc',
        '#e74a3b'
      ],
      borderWidth: 1
    }]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' },
        border: { display: false },
        ticks: {
          callback: (value) => '$' + value
        }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    }
  };

  constructor() {}

  ngOnInit(): void {
    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend,
      ArcElement
    );
  }
}
