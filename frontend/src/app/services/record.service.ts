import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface RecordData {
  id: string;
  userId: string;
  title: string;
  category: string;
  confidentiality: string;
  date: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private readonly apiUrl = 'http://localhost:3000/api/records';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Fetches records based on current user role.
   * Passes x-user-id and x-user-role headers, and a simulated latency parameter.
   */
  getRecords(delayMs: number = 0): Observable<RecordData[]> {
    const user = this.authService.currentUserValue;
    
    if (!user) {
      return throwError(() => new Error('No active authenticated session found.'));
    }

    // Set custom role-based auth headers
    const headers = new HttpHeaders({
      'x-user-id': user.id,
      'x-user-role': user.role
    });

    // Set optional simulated response delay parameter
    let params = new HttpParams();
    if (delayMs > 0) {
      params = params.set('delay', delayMs.toString());
    }

    return this.http.get<RecordData[]>(this.apiUrl, { headers, params }).pipe(
      catchError(err => {
        console.error('Record fetch service failure:', err);
        return throwError(() => new Error(err.error?.error || 'Failed to retrieve access records.'));
      })
    );
  }
}
