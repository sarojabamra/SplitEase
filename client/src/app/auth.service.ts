import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private loggedUserSubject = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.loggedUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  signup(
    username: string,
    name: string,
    email: string,
    mobileNumber: string,
    password: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/auth/signup`,
      {
        username,
        name,
        email,
        mobileNumber,
        password,
      },
      { withCredentials: true }
    );
  }

  signin(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/auth/signin`,
        { username, password },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.loggedUserSubject.next(response.user);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/auth/forgotPassword`,
      {
        email,
      },
      { withCredentials: true }
    );
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/auth/resetPassword`,
      {
        token,
        password,
      },
      { withCredentials: true }
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('user');
    this.loggedUserSubject.next(null);
    return this.http.put<any>(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  getLoggedUser(): Observable<any> {
    return this.loggedUserSubject.asObservable();
  }

  clearLoggedUser(): void {
    this.loggedUserSubject.next(null);
  }
}
