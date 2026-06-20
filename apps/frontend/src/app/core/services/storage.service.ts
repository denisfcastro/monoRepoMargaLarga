import { Injectable, signal, computed } from '@angular/core';

export interface User {
  sub: number;
  email: string;
  nome: string;
  role: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  // Estado puramente em memória (sem localStorage para evitar XSS)
  // Nota: Atualizar a página (F5) resultará no logout do usuário.
  private readonly _token = signal<string | null>(null);
  readonly currentUser = signal<User | null>(null);
  
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  getToken(): string | null {
    return this._token();
  }

  setUser(user: User, token: string): void {
    this._token.set(token);
    this.currentUser.set(user);
  }

  logout(): void {
    this._token.set(null);
    this.currentUser.set(null);
  }
}
