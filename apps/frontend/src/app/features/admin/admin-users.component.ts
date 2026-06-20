import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersAdminService, UserAdmin } from './users.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  private readonly service = inject(UsersAdminService);

  readonly users = signal<UserAdmin[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data) => { this.users.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  toggle(user: UserAdmin): void {
    const newAtivo = !user.ativo;
    // Atualização otimista
    this.users.update((list) =>
      list.map((u) => (u.id === user.id ? { ...u, ativo: newAtivo } : u))
    );
    this.service.toggleActivate(user.id, newAtivo).subscribe({
      error: () => {
        // Reverter se falhou
        this.users.update((list) =>
          list.map((u) => (u.id === user.id ? { ...u, ativo: user.ativo } : u))
        );
      },
    });
  }
}
