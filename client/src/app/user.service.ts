import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000';
  private allUsers: {
    id: string;
    username: string;
    name: string;
    email: string;
  }[] = [];
  private usersSubject = new BehaviorSubject<
    {
      id: string;
      username: string;
      name: string;
      email: string;
    }[]
  >([]);
  users$ = this.usersSubject.asObservable();
  private isUserSearching = new BehaviorSubject<boolean>(false);
  isUserSearching$ = this.isUserSearching.asObservable();
  private loggedUser: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    // Subscribe to logged user changes
    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
      // Update user list when logged user changes
      if (this.allUsers.length > 0) {
        this.updateUserList();
      }
    });
  }

  fetchUsers(): void {
    const url = `${this.apiUrl}/getAllUsers`;
    this.http
      .get<{ id: string; username: string; name: string; email: string }[]>(
        url,
        { withCredentials: true }
      )
      .subscribe(
        (users) => {
          this.allUsers = users;
          this.updateUserList();
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  }

  filterUsers(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.updateUserList();
    } else {
      const filteredUsers = this.allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.updateUserList(filteredUsers);
    }
  }

  private updateUserList(userList?: any[]): void {
    const listToFilter = userList || this.allUsers;

    if (this.loggedUser && this.loggedUser._id) {
      // Filter out the currently logged-in user
      const filteredUsers = listToFilter.filter(
        (user) => user._id !== this.loggedUser._id
      );
      this.usersSubject.next(filteredUsers);
    } else {
      // If no current user, show all users
      this.usersSubject.next(listToFilter);
    }
  }

  setIsUserSearching(value: boolean) {
    this.isUserSearching.next(value);
  }
}
