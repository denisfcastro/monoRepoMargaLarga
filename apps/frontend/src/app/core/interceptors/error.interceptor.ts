import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthStateService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized - Sessão Expirada ou Inválida
      if (error.status === 401) {
        authState.logout();
        router.navigate(['/login'], { queryParams: { expired: true } });
      }
      
      // Erro de rede (Sem conexão / Servidor indisponível)
      if (error.status === 0) {
        // Redefinindo a mensagem para ser mais amigável ao usuário
        const customError = new HttpErrorResponse({
          error: { message: 'Não foi possível conectar ao servidor. Verifique sua conexão.' },
          status: 0,
          statusText: 'Unknown Error',
          url: error.url ?? undefined,
        });
        return throwError(() => customError);
      }

      return throwError(() => error);
    })
  );
};
