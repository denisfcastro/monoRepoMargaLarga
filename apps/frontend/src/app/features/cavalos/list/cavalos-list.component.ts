import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CavalosService, Cavalo } from '../cavalos.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-cavalos-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './cavalos-list.component.html',
})
export class CavalosListComponent implements OnInit {
  private readonly service = inject(CavalosService);
  private readonly toast = inject(ToastService);

  readonly cavalos = signal<Cavalo[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly showModal = signal(false);
  readonly selectedCavalo = signal<Cavalo | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: (data) => { this.cavalos.set(data); this.loading.set(false); },
      error: () => { this.error.set('Erro ao carregar cavalos.'); this.loading.set(false); },
    });
  }

  confirmDelete(cavalo: Cavalo): void {
    this.selectedCavalo.set(cavalo);
    this.showModal.set(true);
  }

  deleteSelected(): void {
    const id = this.selectedCavalo()?.id;
    if (!id) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.cavalos.update((list) => list.filter((c) => c.id !== id));
        this.showModal.set(false);
        this.toast.showSuccess('Cavalo excluído com sucesso.');
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao excluir cavalo.';
        this.toast.showError(msg);
        this.showModal.set(false);
      },
    });
  }
}
