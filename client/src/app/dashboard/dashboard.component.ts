import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { AuthService } from '../auth.service';
import { ExpenseService } from '../expense.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../modal.service';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loggedUser: any;

  isInDebt: boolean = false;
  totalYouOwe: number = 0;
  totalOwedToYou: number = 0;
  usersWhoOweYou: any[] = [];
  totalOwedToYouByUser: number = 0;
  usersYouOwe: any[] = [];
  totalOwedByYouToUser: number = 0;

  // Loading states
  isLoadingUsersYouOwe: boolean = true;
  isLoadingUsersWhoOweYou: boolean = true;
  isLoadingTotals: boolean = true;

  // Chart data
  balanceChartData: any;
  balanceChartOptions: any;
  oweOwedChartData: any;
  oweOwedChartOptions: any;

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.initCharts();

    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
      this.isInDebt = this.loggedUser?.balance?.totalBalance < 0;

      if (this.loggedUser && this.loggedUser._id) {
        this.fetchTotalYouOwe(this.loggedUser._id);
        this.fetchTotalOwedToYou(this.loggedUser._id);
        this.fetchUsersWhoOweYou(this.loggedUser._id);
        this.fetchUsersYouOwe(this.loggedUser._id);
      }
    });
  }

  initCharts() {
    // Balance History Chart
    this.balanceChartData = {
      labels: [
        'Dec 20',
        'Dec 21',
        'Dec 22',
        'Dec 23',
        'Dec 24',
        'Dec 25',
        'Dec 26',
        'Dec 27',
        'Dec 28',
        'Dec 29',
      ],
      datasets: [
        {
          label: 'Total Balance',
          data: [5900, 6300, 6700, 6400, 6800, 7200, 6900, 7300, 7600, 8000],
          fill: true,
          borderColor: '#05cd99',
          backgroundColor: 'rgba(5, 205, 153, 0.1)',
          tension: 0.4,
        },
      ],
    };

    this.balanceChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    };

    // Owe vs Owed Chart
    this.oweOwedChartData = {
      labels: [
        'Dec 10',
        'Dec 11',
        'Dec 12',
        'Dec 13',
        'Dec 14',
        'Dec 15',
        'Dec 16',
        'Dec 17',
        'Dec 18',
        'Dec 19',
        'Dec 20',
        'Dec 21',
        'Dec 22',
        'Dec 23',
        'Dec 24',
        'Dec 25',
        'Dec 26',
        'Dec 27',
        'Dec 28',
        'Dec 29',
      ],
      datasets: [
        {
          label: 'You Owe',
          data: [
            1200, 1500, 1300, 1600, 1400, 1800, 1700, 1900, 2100, 2000, 2200,
            2400, 2300, 2500, 2700, 2600, 2800, 3000, 2900, 3200,
          ],
          fill: false,
          borderColor: '#e31a1a',
          tension: 0.4,
        },
        {
          label: 'You Are Owed',
          data: [
            800, 1000, 900, 1100, 950, 1200, 1150, 1300, 1400, 1350, 1500, 1600,
            1550, 1700, 1800, 1750, 1900, 2000, 1950, 2100,
          ],
          fill: false,
          borderColor: '#05cd99',
          tension: 0.4,
        },
      ],
    };

    this.oweOwedChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    };
  }

  openModal(): void {
    console.log('click');
    const modalData = {
      description: 'Rent',
      amount: 12000,
      paidBy: '6694e31386a6b0cd01542c19',
      splitWith: [
        { user: '6694e2e186a6b0cd01542c15', amount: 6000 },
        { user: '6694e2c586a6b0cd01542c11', amount: 6000 },
      ],
    };
    this.modalService.openAddExpenseModal(modalData);
  }

  getFormattedBalance() {
    const balance = this.loggedUser.balance.totalBalance;
    return {
      absBalance: Math.abs(balance),
      sign: balance < 0 ? '-' : '+',
    };
  }

  fetchUsersWhoOweYou(userId: string): void {
    this.isLoadingUsersWhoOweYou = true;
    this.expenseService.fetchUsersWhoOweYou(userId).subscribe(
      (data) => {
        this.usersWhoOweYou = data.users;
        this.totalOwedToYouByUser = data.totalOwedToYou;
        this.isLoadingUsersWhoOweYou = false;
        console.log('Users who owe you:', this.usersWhoOweYou);
      },
      (error) => {
        console.error('Error fetching users who owe you:', error);
        this.isLoadingUsersWhoOweYou = false;
      }
    );
  }

  fetchUsersYouOwe(userId: string): void {
    this.isLoadingUsersYouOwe = true;
    this.expenseService.fetchUsersYouOwe(userId).subscribe(
      (data) => {
        this.usersYouOwe = data.users;
        this.totalOwedByYouToUser = data.totalOwedByYou;
        this.isLoadingUsersYouOwe = false;
        //console.log('Users you owe:', this.usersYouOwe);
      },
      (error) => {
        console.error('Error fetching users you owe:', error);
        this.isLoadingUsersYouOwe = false;
      }
    );
  }

  fetchTotalYouOwe(userId: string): void {
    this.isLoadingTotals = true;
    this.expenseService.fetchTotalYouOwe(userId).subscribe(
      (data) => {
        //console.log('Total you owe:', data);
        this.totalYouOwe = data.totalOwedByYou;
        this.isLoadingTotals = false;
      },
      (error) => {
        console.error('Error fetching total you owe:', error);
        this.isLoadingTotals = false;
      }
    );
  }

  fetchTotalOwedToYou(userId: string): void {
    this.isLoadingTotals = true;
    this.expenseService.fetchTotalOwedToYou(userId).subscribe(
      (data) => {
        //console.log('Total owed to you:', data);
        this.totalOwedToYou = data.totalOwedToYou;
        this.isLoadingTotals = false;
      },
      (error) => {
        console.error('Error fetching total owed to you:', error);
        this.isLoadingTotals = false;
      }
    );
  }

  getCurrentTime(): string {
    const now = new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (now.toDateString() === today.toDateString()) {
      return `Today, ${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else if (now.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else {
      return (
        now.toLocaleDateString() +
        ', ' +
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0')
      );
    }
  }

  formatTimestamp(timestamp: string | Date): string {
    if (!timestamp) return 'Recently';

    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else {
      return (
        date.toLocaleDateString() +
        ', ' +
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0')
      );
    }
  }
}
