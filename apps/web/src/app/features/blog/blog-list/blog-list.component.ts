import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import type { PostListItemDto, PaginationMeta, TagDto, CategoryDto } from '@my-web/shared';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, DatePipe, FormsModule],
  template: `
    <div class="section">
      <div class="container">
        <!-- Header -->
        <header class="mb-12">
          <div class="divider mb-4"></div>
          <h1 class="text-display-md text-text-primary mb-4">Blog</h1>
          <p class="text-text-secondary text-lg">Articles, tutorials, and thoughts on full stack development.</p>
        </header>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <div class="relative flex-1">
            <input
              type="search"
              class="input pl-10"
              placeholder="Search articles..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch()"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
            </svg>
          </div>
          <select class="input max-w-48" [(ngModel)]="selectedCategory" (ngModelChange)="onFilter()">
            <option value="">All categories</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.slug">{{ cat.name }}</option>
            }
          </select>
        </div>

        <!-- Tags -->
        @if (tags().length > 0) {
          <div class="flex flex-wrap gap-2 mb-8">
            <button
              class="badge transition-colors cursor-pointer"
              [class.badge-accent]="!selectedTag"
              [class.badge-muted]="selectedTag"
              (click)="selectTag('')">
              All
            </button>
            @for (tag of tags(); track tag.id) {
              <button
                class="badge transition-colors cursor-pointer"
                [class.badge-accent]="selectedTag === tag.slug"
                [class.badge-muted]="selectedTag !== tag.slug"
                (click)="selectTag(tag.slug)">
                {{ tag.name }}
              </button>
            }
          </div>
        }

        <!-- Posts Grid -->
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="skeleton h-56 rounded-card"></div>
            }
          </div>
        } @else if (posts().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (post of posts(); track post.id) {
              <a [routerLink]="['/blog', post.slug]" class="card p-6 block group flex flex-col h-full">
                @if (post.coverImage) {
                  <div class="aspect-video mb-4 rounded-lg overflow-hidden bg-bg-muted">
                    <img [src]="post.coverImage" [alt]="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
                  </div>
                }
                <div class="flex items-center gap-2 mb-3">
                  @if (post.category) {
                    <span class="badge badge-accent text-xs">{{ post.category.name }}</span>
                  }
                  @if (post.readingTime) {
                    <span class="text-text-muted text-xs">{{ post.readingTime }} min read</span>
                  }
                </div>
                <h2 class="font-display font-semibold text-text-primary mb-2 group-hover:text-accent-hover transition-colors line-clamp-2 flex-1">
                  {{ post.title }}
                </h2>
                @if (post.excerpt) {
                  <p class="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">{{ post.excerpt }}</p>
                }
                <div class="flex flex-wrap gap-1 mb-4">
                  @for (tag of post.tags.slice(0, 3); track tag.id) {
                    <span class="badge badge-muted text-xs"># {{ tag.name }}</span>
                  }
                </div>
                <time class="text-text-muted text-xs font-mono mt-auto block">
                  {{ post.publishedAt | date: 'MMM d, y' }}
                </time>
              </a>
            }
          </div>
        } @else {
          <div class="text-center py-20">
            <div class="text-5xl mb-4">📝</div>
            <h3 class="text-text-primary font-semibold mb-2">No articles found</h3>
            <p class="text-text-muted text-sm">{{ searchQuery ? 'Try a different search term' : 'Articles coming soon!' }}</p>
          </div>
        }

        <!-- Pagination -->
        @if (meta() && meta()!.totalPages > 1) {
          <div class="flex justify-center gap-2 mt-12">
            <button
              class="btn btn-ghost"
              [disabled]="!meta()!.hasPrev"
              (click)="changePage(currentPage() - 1)">
              ← Previous
            </button>
            <span class="flex items-center px-4 text-text-secondary text-sm">
              {{ currentPage() }} / {{ meta()!.totalPages }}
            </span>
            <button
              class="btn btn-ghost"
              [disabled]="!meta()!.hasNext"
              (click)="changePage(currentPage() + 1)">
              Next →
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class BlogListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly posts = signal<PostListItemDto[]>([]);
  protected readonly meta = signal<PaginationMeta | null>(null);
  protected readonly tags = signal<TagDto[]>([]);
  protected readonly categories = signal<CategoryDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly currentPage = signal(1);

  protected searchQuery = '';
  protected selectedTag = '';
  protected selectedCategory = '';

  private searchTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Blog',
      description: 'Articles, tutorials, and thoughts on full stack development with Angular, Node.js, and PostgreSQL.',
    });
    this.loadPosts();
    this.api.getTags().subscribe({ next: (r) => { if (r.success && r.data) this.tags.set(r.data); } });
    this.api.getCategories().subscribe({ next: (r) => { if (r.success && r.data) this.categories.set(r.data); } });
  }

  protected loadPosts(): void {
    this.loading.set(true);
    this.api.getPosts({
      page: this.currentPage(),
      limit: 9,
      search: this.searchQuery || undefined,
      tagSlug: this.selectedTag || undefined,
      categorySlug: this.selectedCategory || undefined,
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.posts.set(res.data.data);
          this.meta.set(res.data.meta);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.loadPosts();
    }, 400);
  }

  protected onFilter(): void {
    this.currentPage.set(1);
    this.loadPosts();
  }

  protected selectTag(slug: string): void {
    this.selectedTag = slug;
    this.currentPage.set(1);
    this.loadPosts();
  }

  protected changePage(page: number): void {
    this.currentPage.set(page);
    this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
