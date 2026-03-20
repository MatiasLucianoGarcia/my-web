import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import type { ContactDto } from '@my-web/shared';

@Component({
  selector: 'app-admin-messages',
  imports: [DatePipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-display-sm text-text-primary mb-1">Messages</h1>
        <p class="text-text-muted text-sm">Contact form submissions ({{ unread() }} unread)</p>
      </div>

      @if (loading()) {
        <div class="space-y-3">@for (i of [1,2,3]; track i) { <div class="skeleton h-24 rounded-lg"></div> }</div>
      } @else {
        <div class="space-y-4">
          @for (msg of messages(); track msg.id) {
            <div class="card p-5" [class.border-accent]="!msg.read" [class.opacity-60]="msg.read">
              <div class="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p class="font-semibold text-text-primary flex items-center gap-2">
                    {{ msg.name }}
                    @if (!msg.read) { <span class="w-2 h-2 bg-accent rounded-full inline-block"></span> }
                  </p>
                  <a [href]="'mailto:' + msg.email" class="text-accent text-sm hover:text-accent-hover transition-colors">{{ msg.email }}</a>
                </div>
                <div class="text-right flex-shrink-0">
                  <time class="text-text-muted text-xs font-mono block">{{ msg.createdAt | date: 'MMM d, y HH:mm' }}</time>
                  @if (!msg.read) {
                    <button (click)="markRead(msg.id)" class="text-xs text-text-muted hover:text-accent transition-colors mt-1 block">Mark read</button>
                  }
                </div>
              </div>
              <p class="text-text-secondary text-sm font-medium mb-2">{{ msg.subject }}</p>
              <p class="text-text-muted text-sm leading-relaxed">{{ msg.message }}</p>
            </div>
          } @empty {
            <div class="card p-12 text-center text-text-muted">
              <div class="text-4xl mb-3">📬</div>
              <p>No messages yet</p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminMessagesComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly messages = signal<ContactDto[]>([]);
  protected readonly loading = signal(true);

  protected readonly unread = () => this.messages().filter(m => !m.read).length;

  ngOnInit(): void {
    this.api.getContacts().subscribe({
      next: (r) => { if (r.data) this.messages.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  protected markRead(id: string): void {
    this.api.markContactRead(id).subscribe({
      next: () => this.messages.update(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m)),
    });
  }
}
