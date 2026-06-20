import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);
  private nextId = 0;

  show(type: 'success' | 'error' | 'info', message: string): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, type, message }]);
    
    // Auto-remover após 5 segundos
    setTimeout(() => this.remove(id), 5000);
  }

  showSuccess(message: string): void {
    this.show('success', message);
  }

  showError(message: string): void {
    this.show('error', message);
  }

  remove(id: number): void {
    this.toasts.update((t) => t.filter((msg) => msg.id !== id));
  }
}
