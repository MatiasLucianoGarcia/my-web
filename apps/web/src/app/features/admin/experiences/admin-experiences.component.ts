import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import type { ExperienceDto } from '@my-web/shared';

@Component({
  selector: 'app-admin-experiences',
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-display-sm text-text-primary mb-1">Experiences</h1>
          <p class="text-text-muted text-sm">Manage your work history</p>
        </div>
        <button class="btn btn-primary" (click)="showForm.update(v => !v)">
          {{ showForm() ? 'Cancel' : '+ Add Experience' }}
        </button>
      </div>

      @if (showForm()) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card p-6 space-y-4">
          <h2 class="font-semibold text-text-primary">{{ editId() ? 'Edit Experience' : 'New Experience' }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-text-muted text-xs mb-1">Company *</label>
              <input type="text" class="input" formControlName="company"/>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-1">Role *</label>
              <input type="text" class="input" formControlName="role"/>
            </div>
          </div>
          <div>
            <label class="block text-text-muted text-xs mb-1">Description *</label>
            <textarea class="input resize-none" formControlName="description" rows="3"></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-text-muted text-xs mb-1">Start Date *</label>
              <input type="date" class="input" formControlName="startDate"/>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-1">End Date</label>
              <input type="date" class="input" formControlName="endDate" [disabled]="!!form.get('current')?.value"/>
            </div>
            <div class="flex items-end pb-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" formControlName="current" class="w-4 h-4 accent-accent"/>
                <span class="text-text-secondary text-sm">Current job</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-text-muted text-xs mb-1">Stack (comma-sep)</label>
            <input type="text" class="input font-mono text-sm" formControlName="stackString"/>
          </div>
          <div class="flex gap-3">
            <button type="submit" class="btn btn-primary" [disabled]="loading()">{{ loading() ? 'Saving...' : 'Save' }}</button>
            <button type="button" class="btn btn-ghost" (click)="resetForm()">Cancel</button>
          </div>
        </form>
      }

      <div class="space-y-4">
        @for (exp of experiences(); track exp.id) {
          <div class="card p-5 flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <h3 class="font-display font-semibold text-text-primary">{{ exp.role }}</h3>
                @if (exp.current) { <span class="badge badge-accent text-xs">Current</span> }
              </div>
              <p class="text-accent text-sm">{{ exp.company }}</p>
              <p class="text-text-muted text-xs font-mono mt-1">
                {{ exp.startDate | date: 'MMM y' }} — {{ exp.current ? 'Present' : (exp.endDate | date: 'MMM y') }}
              </p>
            </div>
            <div class="flex gap-2 items-start flex-shrink-0">
              <button (click)="editExp(exp)" class="btn btn-ghost text-xs py-1 px-2">Edit</button>
              <button (click)="deleteExp(exp.id)" class="btn btn-ghost text-xs py-1 px-2 text-error hover:bg-error/10">Delete</button>
            </div>
          </div>
        } @empty {
          <div class="card p-12 text-center text-text-muted">No experiences yet</div>
        }
      </div>
    </div>
  `,
})
export class AdminExperiencesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly experiences = signal<ExperienceDto[]>([]);
  protected readonly loading = signal(false);
  protected readonly showForm = signal(false);
  protected readonly editId = signal<string | null>(null);

  protected form = this.fb.group({
    company: ['', Validators.required],
    role: ['', Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    current: [false],
    stackString: [''],
  });

  ngOnInit(): void { this.load(); }
  private load(): void { this.api.getExperiences().subscribe({ next: (r) => { if (r.data) this.experiences.set(r.data); } }); }

  protected editExp(e: ExperienceDto): void {
    this.editId.set(e.id);
    this.showForm.set(true);
    this.form.patchValue({ company: e.company, role: e.role, description: e.description, startDate: e.startDate.slice(0, 10), endDate: e.endDate?.slice(0, 10) ?? '', current: e.current, stackString: e.stack.join(', ') });
  }

  protected resetForm(): void { this.editId.set(null); this.showForm.set(false); this.form.reset(); }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const v = this.form.value;
    const payload = { company: v.company!, role: v.role!, description: v.description!, startDate: new Date(v.startDate!).toISOString(), endDate: v.endDate ? new Date(v.endDate).toISOString() : undefined, current: v.current ?? false, stack: (v.stackString ?? '').split(',').map(s => s.trim()).filter(Boolean) };
    const req = this.editId() ? this.api.updateExperience(this.editId()!, payload) : this.api.createExperience(payload);
    req.subscribe({ next: () => { this.resetForm(); this.load(); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  protected deleteExp(id: string): void {
    if (!confirm('Delete?')) return;
    this.api.deleteExperience(id).subscribe({ next: () => this.load() });
  }
}
