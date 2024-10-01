import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../modal.service';
import { Subscription } from 'rxjs';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit, OnDestroy {
  @Input() userData: any;

  private modalStateSubscription!: Subscription;
  isOpen: boolean = false;

  constructor(
    public modalService: ModalService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.modalStateSubscription = this.modalService.modalState$.subscribe(
      (isOpen) => {
        this.isOpen = isOpen;
        if (!isOpen) {
          this.userData = null;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.modalStateSubscription.unsubscribe();
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  accessChat(userId: string): void {
    this.chatService.accessChat(userId).subscribe(
      (response) => {
        //console.log('Chat access successful', response);
        this.modalService.openChatModal(response);
        this.modalService.closeModal();
      },
      (error) => {
        console.error('Error accessing chat', error);
      }
    );
  }
}
