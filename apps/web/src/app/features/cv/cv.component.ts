import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { ExperiencesService } from '../../core/services/experiences.service';
import { ProjectsService } from '../../core/services/projects.service';
import { SeoService } from '../../core/services/seo.service';
import type { ExperienceDto, ProjectDto } from '@my-web/shared';

@Component({
  selector: 'app-cv',
  imports: [DatePipe],
  styles: [`
    @media print {
      :host { display: block; }
      .no-print { display: none !important; }
      .cv-page { box-shadow: none !important; margin: 0 !important; padding: 2rem !important; max-width: 100% !important; }
      .page-break { break-before: page; }
    }
  `],
  template: `
    <!-- Print / Download Button (hidden when printing) -->
    <div class="no-print fixed top-4 right-4 z-50 flex gap-2">
      <a routerLink="/about" class="btn btn-ghost text-sm">← Back</a>
      <button (click)="print()" class="btn btn-primary text-sm">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Download PDF
      </button>
    </div>

    <!-- CV Page -->
    <div class="min-h-screen bg-bg-muted py-12 px-4 no-print-bg">
      <div class="cv-page max-w-[850px] mx-auto bg-white text-gray-900 shadow-2xl rounded-xl p-12">

        <!-- Header -->
        <header class="border-b-2 border-gray-200 pb-6 mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-1">Matias Garcia</h1>
          <p class="text-lg text-blue-700 font-medium mb-4">
            Senior Software Engineer | Angular · TypeScript · Node.js · Full-Stack
          </p>
          <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            <a href="mailto:mati.luciano.garcia@gmail.com" class="flex items-center gap-1 hover:text-blue-700">
              📧 mati.luciano.garcia&#64;gmail.com
            </a>
            <span class="flex items-center gap-1">📍 Bahía Blanca, Buenos Aires, Argentina</span>
            <a href="https://www.linkedin.com/in/matias-garcia-99bab9170/" target="_blank" class="flex items-center gap-1 hover:text-blue-700">
              💼 linkedin.com/in/matias-garcia-99bab9170
            </a>
            <a href="https://github.com/MatiasLucianoGarcia" target="_blank" class="flex items-center gap-1 hover:text-blue-700">
              🐙 github.com/MatiasLucianoGarcia
            </a>
          </div>
        </header>

        <!-- Summary -->
        <section class="mb-8">
          <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Professional Summary</h2>
          <p class="text-gray-700 leading-relaxed">
            Software Engineer with 6+ years of experience building scalable web applications using Angular,
            TypeScript and Node.js. Experienced in enterprise SaaS platforms, fintech integrations and
            microfrontend architectures, collaborating with international teams to deliver high-quality software.
            Strong background in frontend architecture, performance optimization and full-stack development,
            with a focus on maintainability and scalable systems.
          </p>
        </section>

        <!-- Technical Skills -->
        <section class="mb-8">
          <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Technical Skills</h2>
          <div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
            <div><strong class="text-gray-900">Frontend:</strong> Angular, TypeScript, JavaScript, RxJS, NgRx, Angular Elements, HTML5, CSS3, React</div>
            <div><strong class="text-gray-900">Backend:</strong> Node.js, Express, REST APIs, Laravel, PHP</div>
            <div><strong class="text-gray-900">Databases:</strong> PostgreSQL, MySQL, MariaDB, MongoDB, Prisma ORM</div>
            <div><strong class="text-gray-900">Architecture &amp; Tools:</strong> Microfrontends, Web Components, Agile/Scrum, Kanban, CI/CD, Docker, Performance Optimization</div>
          </div>
        </section>

        <!-- Experience -->
        <section class="mb-8">
          <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Professional Experience</h2>

          @if (loading()) {
            <div class="space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="h-24 bg-gray-100 rounded animate-pulse"></div>
              }
            </div>
          } @else {
            <div class="space-y-6">
              @for (exp of experiences(); track exp.id) {
                <div class="border-l-2 border-blue-600 pl-4">
                  <div class="flex flex-wrap justify-between items-start gap-1 mb-1">
                    <div>
                      <h3 class="font-bold text-gray-900">{{ exp.role }}</h3>
                      <p class="text-blue-700 font-medium text-sm">{{ exp.company }}</p>
                    </div>
                    <p class="text-gray-500 text-xs font-mono shrink-0">
                      {{ exp.startDate | date:'MMM y' }} —
                      {{ exp.current ? 'Present' : (exp.endDate | date:'MMM y') }}
                    </p>
                  </div>
                  <p class="text-gray-600 text-sm leading-relaxed mb-2">{{ exp.description }}</p>
                  @if (exp.stack.length > 0) {
                    <div class="flex flex-wrap gap-1">
                      @for (tech of exp.stack; track tech) {
                        <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">{{ tech }}</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </section>

        <!-- Projects -->
        <section class="mb-8">
          <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Projects</h2>
          @if (!loading()) {
            <div class="space-y-4">
              @for (project of projects(); track project.id) {
                <div class="border-l-2 border-gray-300 pl-4">
                  <div class="flex flex-wrap justify-between items-start gap-1 mb-1">
                    <h3 class="font-bold text-gray-900">{{ project.title }}</h3>
                    @if (project.liveUrl) {
                      <a [href]="project.liveUrl" target="_blank" class="text-blue-600 text-xs hover:underline">{{ project.liveUrl }}</a>
                    }
                  </div>
                  <p class="text-gray-600 text-sm leading-relaxed mb-2">{{ project.description }}</p>
                  @if (project.stack.length > 0) {
                    <div class="flex flex-wrap gap-1">
                      @for (tech of project.stack; track tech) {
                        <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">{{ tech }}</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </section>

        <!-- Education -->
        <section class="mb-6">
          <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Education</h2>
          <div class="space-y-3">
            <div class="flex flex-wrap justify-between">
              <div>
                <h3 class="font-bold text-gray-900">Systems Information Engineer</h3>
                <p class="text-gray-600 text-sm">Universidad Nacional del Sur</p>
              </div>
              <span class="text-gray-500 text-sm">Expected 2026</span>
            </div>
            <div class="flex flex-wrap justify-between">
              <div>
                <h3 class="font-bold text-gray-900">Computer Technician</h3>
                <p class="text-gray-600 text-sm">Instituto Técnico La Piedad</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section>
          <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Languages</h2>
          <div class="flex gap-8 text-sm text-gray-700">
            <div><strong class="text-gray-900">Spanish:</strong> Native</div>
            <div><strong class="text-gray-900">English:</strong> Advanced (written) / Intermediate (spoken)</div>
          </div>
        </section>

      </div>
    </div>
  `,
})
export class CvComponent implements OnInit {
  private readonly experiencesService = inject(ExperiencesService);
  private readonly projectsService = inject(ProjectsService);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly experiences = signal<ExperienceDto[]>([]);
  protected readonly projects = signal<ProjectDto[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'CV — Matias Garcia',
      description: 'Curriculum Vitae — Senior Software Engineer | Angular · TypeScript · Node.js',
    });

    this.experiencesService.getAll().subscribe({
      next: (res) => { if (res.success && res.data) this.experiences.set(res.data); },
      error: () => {},
    });

    this.projectsService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) this.projects.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected print(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }
}
