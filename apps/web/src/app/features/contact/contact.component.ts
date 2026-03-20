import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  template: `
    <div class="section">
      <div class="container-narrow">
        <header class="mb-12">
          <div class="divider mb-4"></div>
          <h1 class="text-display-md text-text-primary mb-4">Let's talk</h1>
          <p class="text-text-secondary text-lg leading-relaxed">
            Open to freelance projects, collaborations, and interesting conversations.
            I usually respond within 24–48 hours.
          </p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <!-- Form -->
          <div class="lg:col-span-3">
            @if (success()) {
              <div class="card p-8 text-center">
                <div class="text-5xl mb-4">✅</div>
                <h2 class="text-display-sm text-text-primary mb-2">Message sent!</h2>
                <p class="text-text-secondary">Thanks for reaching out. I'll get back to you soon.</p>
                <button class="btn btn-ghost mt-6" (click)="success.set(false)">Send another</button>
              </div>
            } @else {
              <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card p-8 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-text-secondary text-sm font-medium mb-2" for="name">Name *</label>
                    <input
                      id="name"
                      type="text"
                      class="input"
                      formControlName="name"
                      placeholder="Your name"
                      [class.border-error]="nameInvalid"
                    />
                    @if (nameInvalid) {
                      <p class="text-error text-xs mt-1">Name is required (min 2 chars)</p>
                    }
                  </div>
                  <div>
                    <label class="block text-text-secondary text-sm font-medium mb-2" for="email">Email *</label>
                    <input
                      id="email"
                      type="email"
                      class="input"
                      formControlName="email"
                      placeholder="your@email.com"
                      [class.border-error]="emailInvalid"
                    />
                    @if (emailInvalid) {
                      <p class="text-error text-xs mt-1">Valid email is required</p>
                    }
                  </div>
                </div>

                <div>
                  <label class="block text-text-secondary text-sm font-medium mb-2" for="subject">Subject *</label>
                  <input
                    id="subject"
                    type="text"
                    class="input"
                    formControlName="subject"
                    placeholder="What's this about?"
                    [class.border-error]="subjectInvalid"
                  />
                  @if (subjectInvalid) {
                    <p class="text-error text-xs mt-1">Subject is required</p>
                  }
                </div>

                <div>
                  <label class="block text-text-secondary text-sm font-medium mb-2" for="message">Message *</label>
                  <textarea
                    id="message"
                    class="input resize-none"
                    formControlName="message"
                    rows="6"
                    placeholder="Tell me about your project, idea, or just say hi..."
                    [class.border-error]="messageInvalid"
                  ></textarea>
                  @if (messageInvalid) {
                    <p class="text-error text-xs mt-1">Message is required (min 10 chars)</p>
                  }
                </div>

                @if (serverError()) {
                  <div class="bg-error/10 border border-error/20 rounded-lg p-4 text-error text-sm">
                    {{ serverError() }}
                  </div>
                }

                <button
                  type="submit"
                  class="btn btn-primary w-full py-3"
                  [disabled]="loading()"
                >
                  @if (loading()) {
                    <span class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                    Sending...
                  } @else {
                    Send message →
                  }
                </button>
              </form>
            }
          </div>

          <!-- Contact Info -->
          <aside class="lg:col-span-2 space-y-6">
            @for (item of contactInfo; track item.label) {
              <div class="card p-5">
                <div class="text-2xl mb-2">{{ item.icon }}</div>
                <h3 class="font-semibold text-text-primary text-sm mb-1">{{ item.label }}</h3>
                @if (item.href) {
                  <a [href]="item.href" class="text-accent text-sm hover:text-accent-hover transition-colors">{{ item.value }}</a>
                } @else {
                  <p class="text-text-muted text-sm">{{ item.value }}</p>
                }
              </div>
            }
          </aside>
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly loading = signal(false);
  protected readonly success = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(2)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected get nameInvalid() { return this.form.get('name')?.invalid && this.form.get('name')?.touched; }
  protected get emailInvalid() { return this.form.get('email')?.invalid && this.form.get('email')?.touched; }
  protected get subjectInvalid() { return this.form.get('subject')?.invalid && this.form.get('subject')?.touched; }
  protected get messageInvalid() { return this.form.get('message')?.invalid && this.form.get('message')?.touched; }

  protected readonly contactInfo = [
    { icon: '📧', label: 'Email', value: 'hello@matiasgarcia.dev', href: 'mailto:hello@matiasgarcia.dev' },
    { icon: '🐙', label: 'GitHub', value: 'github.com/matiaslucianogarcia', href: 'https://github.com/matiaslucianogarcia' },
    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/matiaslucianogarcia', href: 'https://linkedin.com/in/matiaslucianogarcia' },
    { icon: '📍', label: 'Location', value: 'Buenos Aires, Argentina', href: null },
    { icon: '⏰', label: 'Timezone', value: 'ART (UTC-3)', href: null },
  ];

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Contact',
      description: 'Get in touch for freelance projects, collaborations, or just a friendly conversation.',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.serverError.set(null);
    this.api.sendContact(this.form.value as Parameters<typeof this.api.sendContact>[0]).subscribe({
      next: () => {
        this.success.set(true);
        this.form.reset();
        this.loading.set(false);
      },
      error: (err) => {
        this.serverError.set(err?.error?.message ?? 'Something went wrong. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
