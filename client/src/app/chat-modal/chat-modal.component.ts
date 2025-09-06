import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';
import { MessageService } from '../message.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.css'],
})
export class ChatModalComponent implements OnInit {
  chatData: any;
  loggedUser: any;
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

  // Computed property to get the other user (not the logged-in user)
  get otherUser(): any {
    if (!this.chatData?.users || !this.loggedUser) return null;

    // Find the user that is NOT the logged-in user
    return this.chatData.users.find(
      (user: any) => user._id !== this.loggedUser._id
    );
  }

  constructor(
    public modalService: ModalService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.modalService.chatModalData.subscribe((data) => {
      this.chatData = data;
      console.log(this.chatData);
      this.loadMessages();
    });
  }

  ngOnInit() {
    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
    });

    this.messageService.messages$.subscribe((messages) => {
      this.chatMessages = messages;
      console.log(this.chatMessages);
      // Scroll to bottom after messages are loaded
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  loadMessages() {
    if (this.chatData && this.chatData._id) {
      this.messageService.fetchMessages(this.chatData._id);
    }
  }

  scrollToBottom(): void {
    const messagesDiv = document.querySelector('.messages') as HTMLElement;
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
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

  formatTimestamp(timestamp: string | Date): string {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return (
        'Yesterday, ' +
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    } else {
      return (
        date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }) +
        ', ' +
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    }
  }
}
