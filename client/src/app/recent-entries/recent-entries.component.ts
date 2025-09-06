import { Component } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-recent-entries',
  templateUrl: './recent-entries.component.html',
  styleUrl: './recent-entries.component.css',
})
export class RecentEntriesComponent {
  recentEntries: any[] | undefined;
  loggedUser: any;
  isLoading: boolean = true;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Initial state:', {
      isLoading: this.isLoading,
      recentEntries: this.recentEntries,
    });

    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
      if (this.loggedUser && this.loggedUser._id) {
        this.expenseService.fetchExpenses(this.loggedUser._id).subscribe(
          (expenses) => {
            console.log('Expenses received:', expenses);
            this.recentEntries = this.formatRecentEntries(expenses || []);
            console.log('Formatted entries:', this.recentEntries);
            this.recentEntries.reverse();
            this.isLoading = false;
            console.log('Final state:', {
              isLoading: this.isLoading,
              recentEntries: this.recentEntries,
            });
          },
          (error) => {
            console.error('Error fetching expenses:', error);
            this.recentEntries = [];
            this.isLoading = false;
            console.log('Error state:', {
              isLoading: this.isLoading,
              recentEntries: this.recentEntries,
            });
          }
        );
      } else {
        this.recentEntries = [];
        this.isLoading = false;
        console.log('No user state:', {
          isLoading: this.isLoading,
          recentEntries: this.recentEntries,
        });
      }
    });
  }

  formatRecentEntries(expenses: any[]): any[] {
    const formattedEntries: any[] = [];
    console.log('Formatting expenses:', expenses);

    expenses.forEach((expense) => {
      console.log('Processing expense:', expense);
      // Check if user owes or is owed based on paidBy and splitWith
      if (expense.paidBy._id === this.loggedUser._id) {
        // You paid, others owe you
        if (expense.splitWith && expense.splitWith.length > 0) {
          expense.splitWith.forEach((split: { user: any; amount: number }) => {
            formattedEntries.push({
              type: 'owedToYou',
              amount: split.amount,
              user: split.user.name, // This is the person who owes you
              timestamp: expense.createdAt,
            });
          });
        }
      } else {
        // Someone else paid, check if you owe them
        if (expense.splitWith && expense.splitWith.length > 0) {
          expense.splitWith.forEach((split: { user: any; amount: number }) => {
            if (split.user._id === this.loggedUser._id) {
              // You owe money to the person who paid (expense.paidBy)
              formattedEntries.push({
                type: 'youOwe',
                amount: split.amount,
                user: expense.paidBy.name, // This is who you owe money to
                timestamp: expense.createdAt,
              });
            }
          });
        }
      }
    });

    console.log('Final formatted entries:', formattedEntries);
    return formattedEntries;
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
      return (
        now.toLocaleDateString() +
        ', ' +
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0')
      );
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
