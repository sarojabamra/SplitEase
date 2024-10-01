import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  accessChat(userId: string): Observable<any> {
    const url = `${this.apiUrl}/chat`;
    const body = { userId };

    return this.http.post(url, body, { withCredentials: true });
  }
}
