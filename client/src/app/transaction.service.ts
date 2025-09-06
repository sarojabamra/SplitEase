import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Fetch transactions between two specific users
  fetchTransactionsBetweenUsers(
    userId1: string,
    userId2: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/transaction/between/${userId1}/${userId2}`,
      { withCredentials: true }
    );
  }

  // Fetch all transactions for a user
  fetchUserTransactions(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transaction/fetch/${userId}`, {
      withCredentials: true,
    });
  }

  // Record a new transaction
  recordTransaction(transactionData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/transaction/record`,
      transactionData,
      { withCredentials: true }
    );
  }
}
