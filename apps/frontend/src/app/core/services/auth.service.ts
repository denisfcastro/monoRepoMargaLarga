import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthStateService } from './storage.service';
import type { User } from './storage.service';

export interface LoginPayload { email: string; senha: string; }
export interface RegisterPayload { nome: string; email: string; senha: string; }
export interface LoginResponse { access_token: string; }

function parseJwt(token: string): User {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64)) as User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);

  readonly currentUser = this.authState.currentUser;
  readonly isLoggedIn = this.authState.isLoggedIn;
  readonly isAdmin = this.authState.isAdmin;

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((res) => {
        const user = parseJwt(res.access_token);
        this.authState.setUser(user, res.access_token);
      })
    );
  }

  register(payload: RegisterPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/register`, payload);
  }

  logout(): void {
    this.authState.logout();
    void this.router.navigate(['/login']);
  }
}
