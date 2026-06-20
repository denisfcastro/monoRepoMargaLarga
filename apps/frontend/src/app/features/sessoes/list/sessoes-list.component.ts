import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessoesService, SessaoFisio } from '../sessoes.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-sessoes-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sessoes-list.component.html',
})
export class SessoesListComponent implements OnInit {
  private readonly service = inject(SessoesService);
  private readonly toast = inject(ToastService);

  readonly sessoes = signal<SessaoFisio[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly showModal = signal(false);
  readonly selectedSessao = signal<SessaoFisio | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (data) => { this.sessoes.set(data); this.loading.set(false); },
      error: () => { this.error.set('Erro ao carregar sessões.'); this.loading.set(false); },
    });
  }

  confirmDelete(s: SessaoFisio): void {
    this.selectedSessao.set(s);
    this.showModal.set(true);
  }

  deleteSelected(): void {
    const id = this.selectedSessao()?.id;
    if (!id) return;
    this.service.delete(id).subscribe({
      next: () => { 
        this.sessoes.update((list) => list.filter((s) => s.id !== id)); 
        this.showModal.set(false); 
        this.toast.showSuccess('Sessão excluída com sucesso.');
      },
      error: (err) => { 
        const msg = err?.error?.message ?? 'Erro ao excluir sessão.';
        this.toast.showError(msg); 
        this.showModal.set(false); 
      },
    });
  }
}
