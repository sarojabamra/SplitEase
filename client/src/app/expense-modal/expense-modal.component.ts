import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
  styleUrls: ['./expense-modal.component.css'],
})
export class ExpenseModalComponent implements OnInit, OnDestroy {
  modalData: any = {
    description: '',
    amount: 0,
    paidBy: '',
    splitWith: [{ user: '', amount: 0 }],
  };

  private modalStateSubscription: Subscription | undefined;
  isOpen: boolean = false;

  constructor(public modalService: ModalService) {}

  ngOnInit(): void {
    this.modalStateSubscription =
      this.modalService.addExpenseModalState$.subscribe((isOpen) => {
        this.isOpen = isOpen;
        if (isOpen) {
          this.modalService.addExpenseModalData$.subscribe((data) => {
            this.modalData = data || this.modalData; // Update modalData with new data
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.modalStateSubscription) {
      this.modalStateSubscription.unsubscribe();
    }
  }

  openAddExpenseModal(data: any): void {
    this.modalService.openAddExpenseModal(data); // Trigger modal opening
  }

  closeModal(): void {
    this.modalService.closeAddExpenseModal();
  }

  addSplit(): void {
    this.modalData.splitWith.push({ user: '', amount: 0 });
  }

  removeSplit(index: number): void {
    this.modalData.splitWith.splice(index, 1);
  }

  submit(): void {
    console.log(this.modalData);
    this.closeModal();
    // Send this.modalData to your backend or handle it as needed
  }
}
