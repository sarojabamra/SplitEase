import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ExpenseService } from '../expense.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loggedUser: any;

  totalYouOwe: number = 0;
  totalOwedToYou: number = 0;
  usersWhoOweYou: any[] = [];
  totalOwedToYouByUser: number = 0;
  usersYouOwe: any[] = [];
  totalOwedByYouToUser: number = 0;

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
    });

    this.fetchTotalYouOwe(this.loggedUser._id);
    this.fetchTotalOwedToYou(this.loggedUser._id);
    this.fetchUsersWhoOweYou(this.loggedUser._id);
    this.fetchUsersYouOwe(this.loggedUser._id);
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
    this.expenseService.fetchUsersWhoOweYou(userId).subscribe(
      (data) => {
        this.usersWhoOweYou = data.users;
        this.totalOwedToYouByUser = data.totalOwedToYou;
        console.log('Users who owe you:', this.usersWhoOweYou);
      },
      (error) => {
        console.error('Error fetching users who owe you:', error);
      }
    );
  }

  fetchUsersYouOwe(userId: string): void {
    this.expenseService.fetchUsersYouOwe(userId).subscribe(
      (data) => {
        this.usersYouOwe = data.users;
        this.totalOwedByYouToUser = data.totalOwedByYou;
        //console.log('Users you owe:', this.usersYouOwe);
      },
      (error) => {
        console.error('Error fetching users you owe:', error);
      }
    );
  }

  fetchTotalYouOwe(userId: string): void {
    this.expenseService.fetchTotalYouOwe(userId).subscribe(
      (data) => {
        //console.log('Total you owe:', data);
        this.totalYouOwe = data.totalOwedByYou;
      },
      (error) => {
        console.error('Error fetching total you owe:', error);
      }
    );
  }

  fetchTotalOwedToYou(userId: string): void {
    this.expenseService.fetchTotalOwedToYou(userId).subscribe(
      (data) => {
        //console.log('Total owed to you:', data);
        this.totalOwedToYou = data.totalOwedToYou;
      },
      (error) => {
        console.error('Error fetching total owed to you:', error);
      }
    );
  }
}
