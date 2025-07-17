import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { AuthService } from './auth.service';
import { UserRegister } from '../models/UserRegister';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5141/api/Auth/users';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getUsers(): Observable<User[]> {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  registerUser(data: UserRegister) {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post('http://localhost:5141/api/Auth/register', data, { headers });
  }

  getRoles() {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<string[]>('http://localhost:5141/api/Auth/roles', { headers });
  }

  updateUser(id: string, data: { id: string; email: string; phoneNumber: string }) {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`http://localhost:5141/api/Auth/users/${id}`, data, { headers });
  }

  deleteUser(id: string) {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`http://localhost:5141/api/Auth/users/${id}`, { headers });
  }
} 