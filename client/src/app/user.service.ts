import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

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
          this.usersSubject.next(users); 
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  }

  filterUsers(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.usersSubject.next(this.allUsers); // If empty search, show all users
    } else {
      const filteredUsers = this.allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.usersSubject.next(filteredUsers); // Update users with filtered results
    }
  }

  setIsUserSearching(value: boolean) {
    this.isUserSearching.next(value);
    //console.log(this.isUserSearching);
  }
}
