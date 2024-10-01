import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalState.asObservable();

  private modalData = new BehaviorSubject<any>(null);
  modalData$ = this.modalData.asObservable();

  private addExpenseModalState = new BehaviorSubject<boolean>(false);
  addExpenseModalState$ = this.addExpenseModalState.asObservable();

  private addExpenseModalData = new BehaviorSubject<any>(null);
  addExpenseModalData$ = this.addExpenseModalData.asObservable();

  private chatModalState = new BehaviorSubject<boolean>(false);
  chatModalState$ = this.chatModalState.asObservable();
  chatModalData = new BehaviorSubject<any>(null);

  constructor() {}

  openAddExpenseModal(data: any): void {
    this.addExpenseModalData.next(data);
    this.addExpenseModalState.next(true);
    console.log('is this being called?', this.addExpenseModalState);
  }

  closeAddExpenseModal(): void {
    this.addExpenseModalState.next(false);
    //console.log(this.modalState);
  }

  openModal(data: any): void {
    this.modalData.next(data);
    this.modalState.next(true);
  }

  closeModal(): void {
    this.modalState.next(false);
    //console.log(this.modalState);
  }

  openChatModal(data: any): void {
    this.chatModalData.next(data);
    this.chatModalState.next(true);
    //console.log(this.chatModalState);
  }

  closeChatModal(): void {
    this.chatModalData.next(null);
    this.chatModalState.next(false);
  }
}
