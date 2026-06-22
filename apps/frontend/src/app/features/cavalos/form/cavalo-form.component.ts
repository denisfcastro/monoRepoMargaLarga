import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CavalosService } from '../cavalos.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-cavalo-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cavalo-form.component.html',
})
export class CavaloFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(CavalosService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly apiError = signal<string | null>(null);
  private readonly cavaloId = signal<number | null>(null);
  readonly isEditMode = computed(() => this.cavaloId() !== null);

  readonly form = this.fb.group({
    nome: ['', [Validators.required]],
    nomeHaras: ['', [Validators.required]],
    dataAquisicao: ['', [Validators.required]],
    valorCompra: [0, [Validators.required, Validators.min(0.01)]],
    emTratamento: [true],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cavaloId.set(Number(id));
      this.service.getById(Number(id)).subscribe({
        next: (c) => {
          this.form.patchValue({
            nome: c.nome,
            nomeHaras: c.nomeHaras,
            dataAquisicao: c.dataAquisicao ? c.dataAquisicao.split('T')[0] : '',
            valorCompra: c.valorCompra,
            emTratamento: c.emTratamento,
          });
        },
        error: (err) => { 
          this.toast.showError('Não foi possível carregar os dados do cavalo. Recurso não encontrado.');
          void this.router.navigate(['/cavalos']);
        },
      });
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading.set(true);
    this.apiError.set(null);

    const data = this.form.value as { nome: string; nomeHaras: string; dataAquisicao: string; valorCompra: number; emTratamento: boolean };
    const req$ = this.isEditMode()
      ? this.service.update(this.cavaloId()!, data)
      : this.service.create(data);

    req$.subscribe({
      next: () => {
        this.toast.showSuccess(this.isEditMode() ? 'Cavalo atualizado com sucesso!' : 'Cavalo cadastrado com sucesso!');
        void this.router.navigate(['/cavalos']);
      },
      error: (err) => {
        const body = err?.error;
        const msg = body?.message ?? 'Erro ao salvar cavalo.';
        this.apiError.set(msg);
        
        // Mapear erros de validação do backend (class-validator) para os campos
        if (body?.errors && Array.isArray(body.errors)) {
          body.errors.forEach((validationErr: { field: string; messages: string[] }) => {
            const ctrl = this.form.get(validationErr.field);
            if (ctrl) {
              ctrl.setErrors({ serverError: validationErr.messages.join(', ') });
            }
          });
        }
        
        this.loading.set(false);
      },
    });
  }
}
