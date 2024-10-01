import { Component } from '@angular/core';
import { ModalService } from '../modal.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.css'],
})
export class ChatModalComponent {
  chatData: any;
  chatMessages: {
    id: string;
    sender: any;
    content: string;
    timestamp: string;
  }[] = [];
  messageForm = {
    content: '',
  };
  errorMessage = '';

  constructor(
    public modalService: ModalService,
    private messageService: MessageService
  ) {
    this.modalService.chatModalData.subscribe((data) => {
      this.chatData = data;
      console.log(this.chatData);
      this.loadMessages();
    });
  }

  ngOnInit() {
    this.messageService.messages$.subscribe((messages) => {
      this.chatMessages = messages;
      console.log(this.chatMessages);
    });
  }

  loadMessages() {
    if (this.chatData && this.chatData._id) {
      this.messageService.fetchMessages(this.chatData._id);
    }
  }

  onSendMessage() {
    if (this.messageForm.content == '') {
      this.errorMessage = 'The message cannot be empty.';
      return;
    }

    this.messageService
      .sendMessage(this.messageForm.content, this.chatData._id)
      .subscribe(
        (response) => {
          this.errorMessage = '';
          this.messageForm.content = '';
          console.log(response);
          this.loadMessages();
        },
        (error) => {
          this.errorMessage = error.error.msg || 'Error during Sign in.';
        }
      );
  }

  closeChatModal(): void {
    this.modalService.closeChatModal();
  }
}
