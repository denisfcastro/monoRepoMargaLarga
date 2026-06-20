import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserAdmin {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  role: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class UsersAdminService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  getAll(): Observable<UserAdmin[]> {
    return this.http.get<UserAdmin[]>(this.base);
  }

  toggleActivate(id: number, ativo: boolean): Observable<UserAdmin> {
    return this.http.patch<UserAdmin>(`${this.base}/${id}/activate`, { ativo });
  }
}
