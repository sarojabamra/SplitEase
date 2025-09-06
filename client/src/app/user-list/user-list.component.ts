import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ModalService } from '../modal.service';
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: {
    id: string;
    username: string;
    name: string;
    email: string;
  }[] = [];
  recentChats: any[] = [];
  isUserSearching: boolean = false;
  selectedUser: any;
  loggedUser: any;

  constructor(
    private userService: UserService,
    public modalService: ModalService,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userService.users$.subscribe((users) => {
      this.users = users;
    });

    this.userService.isUserSearching$.subscribe((value) => {
      this.isUserSearching = value;
      if (!value) {
        this.loadRecentChats();
      }
    });

    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
      if (user && !this.isUserSearching) {
        this.loadRecentChats();
      }
    });
  }

  stopSearching() {
    this.userService.setIsUserSearching(false);
  }

  openUserModal(user: any): void {
    this.selectedUser = user;
    this.modalService.openModal(user);
  }

  loadRecentChats() {
    if (this.loggedUser && this.loggedUser._id) {
      this.chatService.fetchChats().subscribe(
        (chats: any[]) => {
          // Sort chats by latest message timestamp, newest first
          this.recentChats = chats.sort((a, b) => {
            const aTime = a.latestMessage?.createdAt
              ? new Date(a.latestMessage.createdAt).getTime()
              : 0;
            const bTime = b.latestMessage?.createdAt
              ? new Date(b.latestMessage.createdAt).getTime()
              : 0;
            return bTime - aTime; // Descending order (newest first)
          });
          console.log('Recent chats loaded and sorted:', this.recentChats);
        },
        (error: any) => {
          console.error('Error fetching recent chats:', error);
        }
      );
    }
  }

  openChat(chat: any): void {
    this.modalService.openChatModal(chat);
  }

  getOtherUser(chat: any): any {
    if (!chat.users || !this.loggedUser) return null;
    return chat.users.find((user: any) => user._id !== this.loggedUser._id);
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
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }
}
