import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import type { ExperimentDto } from '@my-web/shared';
import { ExperimentStatus } from '@my-web/shared';

@Component({
  selector: 'app-admin-experiments',
  imports: [ReactiveFormsModule, SlicePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-display-sm text-text-primary mb-1">Experiments</h1>
          <p class="text-text-muted text-sm">Manage your lab experiments</p>
        </div>
        <button class="btn btn-primary" (click)="showForm.update(v => !v)">
          {{ showForm() ? 'Cancel' : '+ Add Experiment' }}
        </button>
      </div>

      @if (showForm()) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card p-6 space-y-4">
          <h2 class="font-semibold text-text-primary">{{ editId() ? 'Edit Experiment' : 'New Experiment' }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-text-muted text-xs mb-1">Title *</label>
              <input type="text" class="input" formControlName="title" (blur)="autoSlug()"/>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-1">Slug *</label>
              <input type="text" class="input font-mono text-sm" formControlName="slug"/>
            </div>
          </div>
          <div>
            <label class="block text-text-muted text-xs mb-1">Description *</label>
            <textarea class="input resize-none" formControlName="description" rows="3"></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-text-muted text-xs mb-1">Status</label>
              <select class="input" formControlName="status">
                @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
              </select>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-1">Stack (comma-sep)</label>
              <input type="text" class="input font-mono text-sm" formControlName="stackString"/>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-1">Demo URL</label>
              <input type="url" class="input" formControlName="demoUrl"/>
            </div>
          </div>
          <div class="flex gap-3">
            <button type="submit" class="btn btn-primary" [disabled]="loading()">{{ loading() ? 'Saving...' : 'Save' }}</button>
            <button type="button" class="btn btn-ghost" (click)="resetForm()">Cancel</button>
          </div>
        </form>
      }

      <div class="card overflow-hidden">
        <table class="w-full text-sm">
          <thead><tr class="border-b border-border">
            <th class="text-left p-4 text-text-muted font-semibold">Title</th>
            <th class="text-left p-4 text-text-muted font-semibold hidden sm:table-cell">Status</th>
            <th class="p-4"></th>
          </tr></thead>
          <tbody>
            @for (exp of experiments(); track exp.id) {
              <tr class="border-b border-border-muted hover:bg-bg-muted/50 transition-colors">
                <td class="p-4">
                  <p class="font-medium text-text-primary">{{ exp.title }}</p>
                  <p class="text-text-muted text-xs mt-0.5">{{ exp.description | slice: 0:80 }}...</p>
                </td>
                <td class="p-4 hidden sm:table-cell">
                  <span class="badge badge-muted text-xs">{{ exp.status }}</span>
                </td>
                <td class="p-4">
                  <div class="flex gap-2 justify-end">
                    <button (click)="editExp(exp)" class="btn btn-ghost text-xs py-1 px-2">Edit</button>
                    <button (click)="deleteExp(exp.id)" class="btn btn-ghost text-xs py-1 px-2 text-error hover:bg-error/10">Delete</button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="3" class="p-12 text-center text-text-muted">No experiments yet</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminExperimentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly experiments = signal<ExperimentDto[]>([]);
  protected readonly loading = signal(false);
  protected readonly showForm = signal(false);
  protected readonly editId = signal<string | null>(null);
  protected readonly statuses = Object.values(ExperimentStatus);

  protected form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    description: ['', Validators.required],
    status: [ExperimentStatus.IDEA],
    stackString: [''],
    demoUrl: [''],
  });

  ngOnInit(): void { this.load(); }
  private load(): void { this.api.getExperiments().subscribe({ next: (r) => { if (r.data) this.experiments.set(r.data); } }); }

  protected autoSlug(): void {
    if (this.form.get('slug')?.dirty) return;
    const slug = (this.form.get('title')?.value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    this.form.patchValue({ slug });
  }

  protected editExp(e: ExperimentDto): void {
    this.editId.set(e.id);
    this.showForm.set(true);
    this.form.patchValue({ title: e.title, slug: e.slug, description: e.description, status: e.status as ExperimentStatus, stackString: e.stack.join(', '), demoUrl: e.demoUrl ?? '' });
  }

  protected resetForm(): void { this.editId.set(null); this.showForm.set(false); this.form.reset({ status: ExperimentStatus.IDEA }); }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const v = this.form.value;
    const payload = { title: v.title!, slug: v.slug!, description: v.description!, status: v.status as ExperimentStatus, stack: (v.stackString ?? '').split(',').map((s: string) => s.trim()).filter(Boolean), demoUrl: v.demoUrl || undefined };
    const req = this.editId() ? this.api.updateExperiment(this.editId()!, payload) : this.api.createExperiment(payload);
    req.subscribe({ next: () => { this.resetForm(); this.load(); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  protected deleteExp(id: string): void {
    if (!confirm('Delete?')) return;
    this.api.deleteExperiment(id).subscribe({ next: () => this.load() });
  }
}
