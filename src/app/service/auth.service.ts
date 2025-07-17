import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5141/api/Auth/login';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, data).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
} 