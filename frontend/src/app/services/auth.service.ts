import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'General User';
}

interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    // Parse cached session from localStorage on application start
    const cachedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      cachedUser ? JSON.parse(cachedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'Admin';
  }

  /**
   * Submits user credentials to backend auth API.
   * On success, caches token and user object in local storage.
   */
  login(id: string, password: string, role: 'Admin' | 'General User'): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { id, password, role }).pipe(
      map(response => {
        // Cache user and token
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        
        // Notify subscribers of login
        this.currentUserSubject.next(response.user);
        return response.user;
      }),
      catchError(err => {
        console.error('Login service failure:', err);
        return throwError(() => new Error(err.error?.error || 'Authentication server failed. Please try again.'));
      })
    );
  }

  /**
   * Cleans up local session storage and resets state subject.
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  /**
   * Helper to retrieve auth token for HTTP interceptors/headers.
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
