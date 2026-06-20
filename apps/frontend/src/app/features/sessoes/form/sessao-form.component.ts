import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SessoesService } from '../sessoes.service';
import { CavalosService, Cavalo } from '../../cavalos/cavalos.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-sessao-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sessao-form.component.html',
})
export class SessaoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(SessoesService);
  private readonly cavaService = inject(CavalosService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly apiError = signal<string | null>(null);
  readonly cavalos = signal<Cavalo[]>([]);
  private readonly sessaoId = signal<number | null>(null);
  readonly isEditMode = computed(() => this.sessaoId() !== null);

  readonly form = this.fb.group({
    cavaloId: [0, [Validators.required, Validators.min(1)]],
    dataSessao: ['', [Validators.required]],
    duracaoMin: [30, [Validators.required, Validators.min(30), Validators.max(90)]],
    focoLesao: ['', [Validators.required]],
    progressoBoa: [false],
  });

  ngOnInit(): void {
    this.cavaService.getAll().subscribe({ next: (d) => this.cavalos.set(d) });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sessaoId.set(Number(id));
      this.service.getById(Number(id)).subscribe({
        next: (s) => {
          this.form.patchValue({
            cavaloId: s.cavaloId,
            dataSessao: s.dataSessao,
            duracaoMin: s.duracaoMin,
            focoLesao: s.focoLesao,
            progressoBoa: s.progressoBoa,
          });
        },
        error: (err) => {
          this.toast.showError('Erro ao carregar dados da sessão. Recurso não encontrado.');
          void this.router.navigate(['/sessoes']);
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

    const raw = this.form.value;
    const data = {
      cavaloId: Number(raw.cavaloId),
      dataSessao: raw.dataSessao!,
      duracaoMin: Number(raw.duracaoMin),
      focoLesao: raw.focoLesao!,
      progressoBoa: raw.progressoBoa ?? false,
    };

    const req$ = this.isEditMode()
      ? this.service.update(this.sessaoId()!, data)
      : this.service.create(data);

    req$.subscribe({
      next: () => {
        this.toast.showSuccess(this.isEditMode() ? 'Sessão atualizada com sucesso!' : 'Sessão cadastrada com sucesso!');
        void this.router.navigate(['/sessoes']);
      },
      error: (err) => {
        const body = err?.error;
        const msg = body?.message ?? 'Erro ao salvar sessão.';
        this.apiError.set(msg);
        
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
