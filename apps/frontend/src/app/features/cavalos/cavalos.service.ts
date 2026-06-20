import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cavalo {
  id: number;
  nome: string;
  nomeHaras: string;
  dataAquisicao: string;
  emTratamento: boolean;
  valorCompra: number;
  sessoes?: unknown[];
}

export type CreateCavaloDto = Omit<Cavalo, 'id' | 'sessoes'>;

@Injectable({ providedIn: 'root' })
export class CavalosService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/cavalos`;

  getAll(): Observable<Cavalo[]> {
    return this.http.get<Cavalo[]>(this.base);
  }

  getById(id: number): Observable<Cavalo> {
    return this.http.get<Cavalo>(`${this.base}/${id}`);
  }

  create(data: CreateCavaloDto): Observable<Cavalo> {
    return this.http.post<Cavalo>(this.base, data);
  }

  update(id: number, data: Partial<CreateCavaloDto>): Observable<Cavalo> {
    return this.http.patch<Cavalo>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
