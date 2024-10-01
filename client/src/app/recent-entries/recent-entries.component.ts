import { Component } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-recent-entries',
  templateUrl: './recent-entries.component.html',
  styleUrl: './recent-entries.component.css',
})
export class RecentEntriesComponent {
  recentEntries: any[] = [];
  loggedUser: any;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
    });

    this.expenseService.fetchExpenses(this.loggedUser._id).subscribe(
      (expenses) => {
        this.recentEntries = this.formatRecentEntries(expenses);
        console.log(expenses);
        this.recentEntries.reverse();
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  formatRecentEntries(expenses: any[]): any[] {
    const formattedEntries: any[] = [];

    expenses.forEach((expense) => {
      // Check if user owes or is owed based on paidBy and splitWith
      if (expense.paidBy._id === this.loggedUser._id) {
        // You paid, others owe you
        if (expense.splitWith && expense.splitWith.length > 0) {
          expense.splitWith.forEach((split: { user: any; amount: number }) => {
            formattedEntries.push({
              type: 'owedToYou',
              amount: split.amount,
              user: split.user.name,
            });
          });
        }
      } else {
        // Also check if you owe anyone in splitWith
        if (expense.splitWith && expense.splitWith.length > 0) {
          expense.splitWith.forEach((split: { user: any; amount: number }) => {
            if (split.user._id === this.loggedUser._id) {
              // Check if you owe this user
              formattedEntries.push({
                type: 'youOwe',
                amount: split.amount,
                user: split.user.name, 
              });
            }
          });
        }
      }
    });

    return formattedEntries;
  }
}
