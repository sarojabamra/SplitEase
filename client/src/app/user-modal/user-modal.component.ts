import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ModalService } from '../modal.service';
import { Subscription } from 'rxjs';
import { ChatService } from '../chat.service';
import { ExpenseService } from '../expense.service';
import { TransactionService } from '../transaction.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() userData: any;
  transactions: any[] = []; // Array to store transactions with this user
  private modalStateSubscription!: Subscription;
  loggedUser: any;

  constructor(
    public modalService: ModalService,
    private expenseService: ExpenseService,
    private chatService: ChatService,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {
    this.modalStateSubscription = this.modalService.modalState$.subscribe(
      (isOpen) => {
        if (!isOpen) {
          this.userData = null;
        }
      }
    );
  }

  ngOnInit() {
    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
      if (this.userData && this.loggedUser) {
        this.loadTransactions();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userData'] && changes['userData'].currentValue) {
      if (this.loggedUser) {
        this.loadTransactions();
      }
    }
  }

  ngOnDestroy() {
    if (this.modalStateSubscription) {
      this.modalStateSubscription.unsubscribe();
    }
  }

  loadTransactions() {
    if (!this.userData || !this.loggedUser) {
      return;
    }

    this.transactionService
      .fetchTransactionsBetweenUsers(this.loggedUser._id, this.userData._id)
      .subscribe(
        (transactions) => {
          this.transactions = transactions;
        },
        (error) => {
          console.error('Error fetching transactions:', error);
          // Fallback to empty array if API fails
          this.transactions = [];
        }
      );
  }

  formatDate(date: Date | string): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '';

    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }

  addExpense() {
    // TODO: Implement add expense functionality
    console.log('Add expense with user:', this.userData._id);
    // This could open the expense modal or navigate to expense creation
  }

  settleUp() {
    // TODO: Implement settle up functionality
    console.log('Settle up with user:', this.userData._id);
    // This could open a settle up modal or process the settlement
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  accessChat(userId: string): void {
    this.chatService.accessChat(userId).subscribe(
      (response) => {
        this.modalService.openChatModal(response);
        this.modalService.closeModal();
      },
      (error) => {
        console.error('Error accessing chat', error);
      }
    );
  }
}
