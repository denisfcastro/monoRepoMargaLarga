import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SessaoFisio {
  id: number;
  cavaloId: number;
  dataSessao: string;
  duracaoMin: number;
  focoLesao: string;
  progressoBoa: boolean;
  cavalo?: { id: number; nome: string };
}

export type CreateSessaoDto = Omit<SessaoFisio, 'id' | 'cavalo'>;

@Injectable({ providedIn: 'root' })
export class SessoesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/sessoes`;

  getAll(): Observable<SessaoFisio[]> {
    return this.http.get<SessaoFisio[]>(this.base);
  }

  getById(id: number): Observable<SessaoFisio> {
    return this.http.get<SessaoFisio>(`${this.base}/${id}`);
  }

  create(data: CreateSessaoDto): Observable<SessaoFisio> {
    return this.http.post<SessaoFisio>(this.base, data);
  }

  update(id: number, data: Partial<CreateSessaoDto>): Observable<SessaoFisio> {
    return this.http.patch<SessaoFisio>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
