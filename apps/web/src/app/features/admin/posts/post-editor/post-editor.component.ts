import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import type { TagDto, CategoryDto } from '@my-web/shared';
import { PostStatus } from '@my-web/shared';

@Component({
  selector: 'app-post-editor',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-4xl">
      <div class="flex items-center justify-between">
        <div>
          <a routerLink="/admin/posts" class="text-text-muted text-sm hover:text-accent transition-colors">← Posts</a>
          <h1 class="text-display-sm text-text-primary mt-1">{{ postId() ? 'Edit Post' : 'New Post' }}</h1>
        </div>
        <div class="flex gap-3">
          <button type="button" class="btn btn-ghost" (click)="onSave('DRAFT')" [disabled]="loading()">Save draft</button>
          <button type="button" class="btn btn-primary" (click)="onSave('PUBLISHED')" [disabled]="loading()">
            {{ loading() ? 'Publishing...' : 'Publish' }}
          </button>
        </div>
      </div>

      @if (success()) {
        <div class="bg-success/10 border border-success/20 rounded-lg p-3 text-success text-sm">✅ Post saved successfully</div>
      }
      @if (error()) {
        <div class="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm">{{ error() }}</div>
      }

      <form [formGroup]="form" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-5">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Title *</label>
            <input type="text" class="input text-lg font-display" formControlName="title" placeholder="Your article title..." (blur)="autoSlug()"/>
          </div>
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Slug *</label>
            <div class="flex items-center gap-2">
              <span class="text-text-muted text-sm font-mono">/blog/</span>
              <input type="text" class="input flex-1 font-mono text-sm" formControlName="slug" placeholder="my-article-slug"/>
            </div>
          </div>
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Excerpt</label>
            <textarea class="input resize-none" formControlName="excerpt" rows="2" placeholder="Short description for previews..."></textarea>
          </div>
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Content * (Markdown)</label>
            <textarea
              class="input resize-y font-mono text-sm leading-relaxed"
              formControlName="content"
              rows="24"
              placeholder="Write your content in Markdown..."
            ></textarea>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="space-y-5">
          <div class="card p-5 space-y-4">
            <h3 class="font-semibold text-text-primary text-sm">Publishing</h3>
            <div>
              <label class="block text-text-muted text-xs mb-2">Category</label>
              <select class="input text-sm" formControlName="categoryId">
                <option value="">No category</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-2">Tags (comma separated)</label>
              <input type="text" class="input text-sm" formControlName="tagString" placeholder="angular, typescript, ..."/>
            </div>
            <div class="flex items-center gap-3">
              <input type="checkbox" id="featured" formControlName="featured" class="w-4 h-4 accent-accent"/>
              <label for="featured" class="text-text-secondary text-sm">Featured post</label>
            </div>
          </div>

          <div class="card p-5 space-y-4">
            <h3 class="font-semibold text-text-primary text-sm">SEO</h3>
            <div>
              <label class="block text-text-muted text-xs mb-2">Meta title (70 chars)</label>
              <input type="text" class="input text-sm" formControlName="metaTitle" maxlength="70"/>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-2">Meta description (160 chars)</label>
              <textarea class="input text-sm resize-none" formControlName="metaDescription" rows="3" maxlength="160"></textarea>
            </div>
            <div>
              <label class="block text-text-muted text-xs mb-2">Cover image URL</label>
              <input type="url" class="input text-sm" formControlName="coverImage" placeholder="https://..."/>
            </div>
          </div>
        </aside>
      </form>
    </div>
  `,
})
export class PostEditorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly postId = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly success = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly categories = signal<CategoryDto[]>([]);
  protected readonly tags = signal<TagDto[]>([]);

  protected form = this.fb.group({
    title: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    excerpt: [''],
    content: ['', [Validators.required]],
    categoryId: [''],
    tagString: [''],
    featured: [false],
    metaTitle: [''],
    metaDescription: [''],
    coverImage: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postId.set(id);
      // Load post for edit
      this.api.getAdminPosts({ limit: 100 }).subscribe((res) => {
        const post = res.data?.data.find((p) => p.id === id);
        if (post) {
          this.form.patchValue({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? '',
            featured: post.featured,
          });
        }
      });
    }
    this.api.getCategories().subscribe((r) => { if (r.data) this.categories.set(r.data); });
    this.api.getTags().subscribe((r) => { if (r.data) this.tags.set(r.data); });
  }

  protected autoSlug(): void {
    if (this.form.get('slug')?.dirty) return;
    const title = this.form.get('title')?.value ?? '';
    const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    this.form.patchValue({ slug });
  }

  protected onSave(status: 'DRAFT' | 'PUBLISHED'): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const v = this.form.value;
    // Resolve tag IDs from tag string
    const tagNames = (v.tagString ?? '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const tagIds = this.tags().filter((t) => tagNames.includes(t.name.toLowerCase())).map((t) => t.id);

    const payload = {
      title: v.title!,
      slug: v.slug!,
      excerpt: v.excerpt ?? undefined,
      content: v.content!,
      status: status as PostStatus,
      featured: v.featured ?? false,
      categoryId: v.categoryId ?? undefined,
      tagIds,
      metaTitle: v.metaTitle ?? undefined,
      metaDescription: v.metaDescription ?? undefined,
      coverImage: v.coverImage ?? undefined,
    };

    const req = this.postId()
      ? this.api.updatePost(this.postId()!, payload)
      : this.api.createPost(payload);

    req.subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        if (!this.postId()) void this.router.navigate(['/admin/posts']);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to save post');
        this.loading.set(false);
      },
    });
  }
}
