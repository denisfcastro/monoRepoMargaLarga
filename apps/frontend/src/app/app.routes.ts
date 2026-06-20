import { Routes } from '@angular/router';
import { authGuard, adminGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Rotas públicas (redireciona se já logado)
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  // Dashboard
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },

  // Cavalos
  {
    path: 'cavalos',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/cavalos/list/cavalos-list.component').then((m) => m.CavalosListComponent),
      },
      {
        path: 'novo',
        loadComponent: () =>
          import('./features/cavalos/form/cavalo-form.component').then((m) => m.CavaloFormComponent),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('./features/cavalos/form/cavalo-form.component').then((m) => m.CavaloFormComponent),
      },
    ],
  },

  // Sessões
  {
    path: 'sessoes',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/sessoes/list/sessoes-list.component').then((m) => m.SessoesListComponent),
      },
      {
        path: 'novo',
        loadComponent: () =>
          import('./features/sessoes/form/sessao-form.component').then((m) => m.SessaoFormComponent),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('./features/sessoes/form/sessao-form.component').then((m) => m.SessaoFormComponent),
      },
    ],
  },

  // Admin
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/admin-users.component').then((m) => m.AdminUsersComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'login' },
];
