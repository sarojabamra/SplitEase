import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:8000';
  private allMessages: {
    id: string;
    sender: any;
    content: string;
    timestamp: string;
  }[] = [];
  private messagesSubject = new BehaviorSubject<
    { id: string; sender: any; content: string; timestamp: string }[]
  >([]);

  constructor(private http: HttpClient) {}

  get messages$(): Observable<
    { id: string; sender: string; content: string; timestamp: string }[]
  > {
    return this.messagesSubject.asObservable();
  }

  sendMessage(content: string, chatId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/message/send`,
      {
        content,
        chatId,
      },
      { withCredentials: true }
    );
  }

  fetchMessages(chatId: string): void {
    const url = `${this.apiUrl}/message/${chatId}`;
    this.http
      .get<
        { id: string; sender: string; content: string; timestamp: string }[]
      >(url, { withCredentials: true })
      .subscribe(
        (messages) => {
          this.allMessages = messages;
          this.messagesSubject.next(messages);
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
  }
}
