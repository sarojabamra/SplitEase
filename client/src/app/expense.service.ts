// expense.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Add Expense
  addExpense(expenseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/expense/add`, expenseData, {
      withCredentials: true,
    });
  }

  // Fetch Expenses for a User
  fetchExpenses(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expense/get/${userId}`, {
      withCredentials: true,
    });
  }

  // Fetch Users Who Owe You Money
  fetchUsersWhoOweYou(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/expense/fetchUsersWhoOweYou/${userId}`,
      {
        withCredentials: true,
      }
    );
  }

  fetchUsersYouOwe(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/expense/fetchUsersYouOwe/${userId}`,
      {
        withCredentials: true,
      }
    );
  }

  fetchTotalYouOwe(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expense/totalYouOwe/${userId}`, {
      withCredentials: true,
    });
  }

  fetchTotalOwedToYou(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/expense/totalOwedToYou/${userId}`,
      {
        withCredentials: true,
      }
    );
  }
}
