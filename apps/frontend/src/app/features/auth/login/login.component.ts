import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['expired']) {
        this.errorMessage.set('Sua sessão expirou. Por favor, faça login novamente.');
      } else if (params['unauthorized']) {
        this.errorMessage.set('Acesso negado. Você precisa estar logado para acessar esta página.');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, senha } = this.form.value;
    this.authService.login({ email: email!, senha: senha! }).subscribe({
      next: () => void this.router.navigate(['/dashboard']),
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao realizar login. Tente novamente.';
        this.errorMessage.set(msg);
        this.loading.set(false);
      },
    });
  }
}
