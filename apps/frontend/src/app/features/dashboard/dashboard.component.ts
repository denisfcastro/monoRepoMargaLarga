import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);

  readonly userName = computed(() => this.authService.currentUser()?.nome ?? 'Usuário');
  readonly isAdmin = this.authService.isAdmin;

  logout(): void {
    this.authService.logout();
  }
}
