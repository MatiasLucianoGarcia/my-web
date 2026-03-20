import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import type { ProjectDto } from '@my-web/shared';

@Component({
  selector: 'app-admin-projects',
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-display-sm text-text-primary mb-1">Projects</h1>
          <p class="text-text-muted text-sm">Manage your portfolio projects</p>
        </div>
        <button class="btn btn-primary" (click)="toggleForm()">
          {{ showForm() ? 'Cancel' : '+ Add Project' }}
        </button>
      </div>

      @if (showForm()) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card p-6 space-y-4">
          <h2 class="font-semibold text-text-primary">{{ editId() ? 'Edit Project' : 'New Project' }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-text-muted text-xs mb-1">Title *</label>
              <input type="text" class="input" formControlName="title" placeholder="Project name" (blur)="autoSlug()"/>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-1">Slug *</label>
              <input type="text" class="input font-mono text-sm" formControlName="slug" placeholder="my-project"/>
            </div>
          </div>
          <div>
            <label class="block text-text-muted text-xs mb-1">Description *</label>
            <textarea class="input resize-none" formControlName="description" rows="3" placeholder="Short project description..."></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-text-muted text-xs mb-1">Live URL</label>
              <input type="url" class="input" formControlName="liveUrl" placeholder="https://..."/>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-1">Repo URL</label>
              <input type="url" class="input" formControlName="repoUrl" placeholder="https://github.com/..."/>
            </div>
          </div>
          <div>
            <label class="block text-text-muted text-xs mb-1">Stack (comma-separated)</label>
            <input type="text" class="input font-mono text-sm" formControlName="stackString" placeholder="Angular, TypeScript, Node.js"/>
          </div>
          <div class="flex items-center gap-3">
            <input type="checkbox" id="featured-proj" formControlName="featured" class="w-4 h-4 accent-accent"/>
            <label for="featured-proj" class="text-text-secondary text-sm">Featured project</label>
          </div>
          @if (error()) { <p class="text-error text-sm">{{ error() }}</p> }
          <div class="flex gap-3">
            <button type="submit" class="btn btn-primary" [disabled]="loading()">
              {{ loading() ? 'Saving...' : (editId() ? 'Update' : 'Create') }}
            </button>
            <button type="button" class="btn btn-ghost" (click)="resetForm()">Cancel</button>
          </div>
        </form>
      }

      @if (loadingList()) {
        <div class="space-y-3">@for (i of [1,2,3]; track i) { <div class="skeleton h-16 rounded-lg"></div> }</div>
      } @else {
        <div class="card overflow-hidden">
          <table class="w-full text-sm">
            <thead><tr class="border-b border-border">
              <th class="text-left p-4 text-text-muted font-semibold">Title</th>
              <th class="text-left p-4 text-text-muted font-semibold hidden sm:table-cell">Stack</th>
              <th class="p-4"></th>
            </tr></thead>
            <tbody>
              @for (p of projects(); track p.id) {
                <tr class="border-b border-border-muted hover:bg-bg-muted/50 transition-colors">
                  <td class="p-4">
                    <p class="font-medium text-text-primary">{{ p.title }}</p>
                    @if (p.featured) { <span class="badge badge-accent text-xs mt-1">Featured</span> }
                  </td>
                  <td class="p-4 hidden sm:table-cell">
                    <div class="flex flex-wrap gap-1">
                      @for (tech of p.stack.slice(0, 3); track tech) {
                        <span class="badge badge-muted text-xs">{{ tech }}</span>
                      }
                    </div>
                  </td>
                  <td class="p-4">
                    <div class="flex gap-2 justify-end">
                      <button (click)="editProject(p)" class="btn btn-ghost text-xs py-1 px-2">Edit</button>
                      <button (click)="deleteProject(p.id)" class="btn btn-ghost text-xs py-1 px-2 text-error hover:bg-error/10">Delete</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="3" class="p-12 text-center text-text-muted">No projects yet</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class AdminProjectsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly projects = signal<ProjectDto[]>([]);
  protected readonly loading = signal(false);
  protected readonly loadingList = signal(true);
  protected readonly showForm = signal(false);
  protected readonly editId = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    description: ['', Validators.required],
    liveUrl: [''],
    repoUrl: [''],
    stackString: [''],
    featured: [false],
  });

  ngOnInit(): void { this.loadProjects(); }

  private loadProjects(): void {
    this.api.getProjects().subscribe({
      next: (r) => { if (r.data) this.projects.set(r.data); this.loadingList.set(false); },
      error: () => this.loadingList.set(false),
    });
  }

  protected toggleForm(): void { this.showForm.update(v => !v); if (!this.showForm()) this.resetForm(); }

  protected autoSlug(): void {
    if (this.form.get('slug')?.dirty) return;
    const slug = (this.form.get('title')?.value ?? '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    this.form.patchValue({ slug });
  }

  protected editProject(p: ProjectDto): void {
    this.editId.set(p.id);
    this.showForm.set(true);
    this.form.patchValue({ title: p.title, slug: p.slug, description: p.description, liveUrl: p.liveUrl ?? '', repoUrl: p.repoUrl ?? '', stackString: p.stack.join(', '), featured: p.featured });
  }

  protected resetForm(): void { this.editId.set(null); this.showForm.set(false); this.form.reset(); this.error.set(null); }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const v = this.form.value;
    const payload = { title: v.title!, slug: v.slug!, description: v.description!, liveUrl: v.liveUrl || undefined, repoUrl: v.repoUrl || undefined, stack: (v.stackString ?? '').split(',').map(s => s.trim()).filter(Boolean), featured: v.featured ?? false };
    const req = this.editId() ? this.api.updateProject(this.editId()!, payload) : this.api.createProject(payload);
    req.subscribe({ next: () => { this.resetForm(); this.loadProjects(); this.loading.set(false); }, error: (e) => { this.error.set(e?.error?.message ?? 'Error'); this.loading.set(false); } });
  }

  protected deleteProject(id: string): void {
    if (!confirm('Delete this project?')) return;
    this.api.deleteProject(id).subscribe({ next: () => this.loadProjects() });
  }
}
