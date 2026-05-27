import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Helper to construct admin-cleared authentication headers.
   */
  private getAdminHeaders(): HttpHeaders {
    const user = this.authService.currentUserValue;
    return new HttpHeaders({
      'x-user-id': user?.id || '',
      'x-user-role': user?.role || '',
      'Content-Type': 'application/json'
    });
  }

  /**
   * GET all users (Admin credentials required).
   */
  getUsers(delayMs: number = 0): Observable<User[]> {
    let params = new HttpParams();
    if (delayMs > 0) {
      params = params.set('delay', delayMs.toString());
    }

    return this.http.get<User[]>(this.apiUrl, { headers: this.getAdminHeaders(), params }).pipe(
      catchError(err => {
        console.error('User list retrieval failure:', err);
        return throwError(() => new Error(err.error?.error || 'Failed to fetch directory users.'));
      })
    );
  }

  /**
   * CREATE user (Admin credentials required).
   */
  createUser(userData: any): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData, { headers: this.getAdminHeaders() }).pipe(
      catchError(err => {
        console.error('User creation failure:', err);
        return throwError(() => new Error(err.error?.error || 'Failed to create user.'));
      })
    );
  }

  /**
   * UPDATE user (Admin credentials required).
   */
  updateUser(id: string, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData, { headers: this.getAdminHeaders() }).pipe(
      catchError(err => {
        console.error('User update failure:', err);
        return throwError(() => new Error(err.error?.error || 'Failed to update user.'));
      })
    );
  }

  /**
   * DELETE user (Admin credentials required).
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAdminHeaders() }).pipe(
      catchError(err => {
        console.error('User deletion failure:', err);
        return throwError(() => new Error(err.error?.error || 'Failed to delete user.'));
      })
    );
  }
}
