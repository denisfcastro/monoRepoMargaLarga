import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CavalosService, Cavalo } from '../cavalos/cavalos.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cavalosService = inject(CavalosService);

  readonly userName = computed(() => this.authService.currentUser()?.nome ?? 'Usuário');
  readonly isAdmin = this.authService.isAdmin;

  readonly cavalosEmTratamento = signal<Cavalo[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarCavalosEmTratamento();
  }

  private carregarCavalosEmTratamento(): void {
    this.loading.set(true);
    this.error.set(null);
    this.cavalosService.getAll().subscribe({
      next: (cavalos) => {
        const emTratamento = cavalos.filter(c => c.emTratamento);
        this.cavalosEmTratamento.set(emTratamento);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar lista de cavalos.');
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
