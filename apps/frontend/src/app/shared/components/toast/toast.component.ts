import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="max-w-sm w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all overflow-hidden"
             [class.bg-emerald-800]="toast.type === 'success'"
             [class.bg-red-800]="toast.type === 'error'"
             [class.bg-indigo-800]="toast.type === 'info'">
          <div class="p-4 flex-1">
            <div class="flex items-start">
              <div class="flex-shrink-0 pt-0.5">
                @if (toast.type === 'success') { <span class="text-xl">✅</span> }
                @if (toast.type === 'error') { <span class="text-xl">⚠️</span> }
                @if (toast.type === 'info') { <span class="text-xl">ℹ️</span> }
              </div>
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-white">{{ toast.message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button (click)="toastService.remove(toast.id)" class="bg-transparent rounded-md inline-flex text-gray-300 hover:text-white focus:outline-none">
                  <span class="sr-only">Fechar</span>
                  <span class="text-lg">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
