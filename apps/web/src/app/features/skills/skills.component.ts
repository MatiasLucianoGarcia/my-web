import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

interface SkillItem {
  name: string;
  level?: number; // 1-5
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: SkillItem[];
}

@Component({
  selector: 'app-skills',
  imports: [],
  template: `
    <div class="section">
      <div class="container">
        <header class="mb-12">
          <div class="divider mb-4"></div>
          <h1 class="text-display-md text-text-primary mb-4">Skills &amp; Stack</h1>
          <p class="text-text-secondary text-lg">Technologies I work with regularly and know deeply.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (category of categories; track category.name) {
            <div class="card p-6 h-full">
              <div class="flex items-center gap-3 mb-5">
                <span class="text-2xl">{{ category.icon }}</span>
                <h2 class="font-display font-semibold text-text-primary">{{ category.name }}</h2>
              </div>
              <ul class="space-y-3">
                @for (skill of category.skills; track skill.name) {
                  <li class="flex items-center justify-between">
                    <span class="text-text-secondary text-sm font-medium">{{ skill.name }}</span>
                    @if (skill.level) {
                      <div class="flex gap-1">
                        @for (d of [1,2,3,4,5]; track d) {
                          <div class="w-2 h-2 rounded-full transition-colors"
                               [class.bg-accent]="d <= skill.level!"
                               [class.bg-border]="d > skill.level!"></div>
                        }
                      </div>
                    }
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Tools & Others -->
        <section class="mt-12">
          <h2 class="text-text-secondary text-sm uppercase tracking-wider font-semibold mb-6">Tools &amp; Workflow</h2>
          <div class="flex flex-wrap gap-3">
            @for (tool of tools; track tool) {
              <span class="badge badge-muted text-sm">{{ tool }}</span>
            }
          </div>
        </section>

        <!-- Languages -->
        <section class="mt-10">
          <h2 class="text-text-secondary text-sm uppercase tracking-wider font-semibold mb-6">Languages</h2>
          <div class="flex flex-wrap gap-4">
            <div class="card p-4 flex items-center gap-3">
              <span class="text-2xl">🇦🇷</span>
              <div>
                <p class="font-medium text-text-primary text-sm">Spanish</p>
                <p class="text-text-muted text-xs">Native</p>
              </div>
            </div>
            <div class="card p-4 flex items-center gap-3">
              <span class="text-2xl">🇺🇸</span>
              <div>
                <p class="font-medium text-text-primary text-sm">English</p>
                <p class="text-text-muted text-xs">Advanced (written) / Intermediate (spoken)</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class SkillsComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly categories: SkillCategory[] = [
    {
      name: 'Frontend',
      icon: '🎨',
      skills: [
        { name: 'Angular', level: 5 },
        { name: 'TypeScript', level: 5 },
        { name: 'JavaScript', level: 5 },
        { name: 'RxJS', level: 5 },
        { name: 'NgRx', level: 4 },
        { name: 'Angular Elements', level: 4 },
        { name: 'HTML5 / CSS3', level: 5 },
        { name: 'React', level: 3 },
      ],
    },
    {
      name: 'Backend',
      icon: '⚙️',
      skills: [
        { name: 'Node.js', level: 5 },
        { name: 'Express', level: 5 },
        { name: 'REST API Design', level: 5 },
        { name: 'Laravel', level: 3 },
      ],
    },
    {
      name: 'Databases',
      icon: '🗄️',
      skills: [
        { name: 'PostgreSQL', level: 5 },
        { name: 'MySQL / MariaDB', level: 4 },
        { name: 'MongoDB', level: 3 },
        { name: 'Prisma ORM', level: 5 },
      ],
    },
    {
      name: 'Architecture',
      icon: '🏗️',
      skills: [
        { name: 'Microfrontends', level: 5 },
        { name: 'Web Components', level: 4 },
        { name: 'Performance Optimization', level: 4 },
        { name: 'Clean Architecture', level: 4 },
        { name: 'SOLID Principles', level: 5 },
      ],
    },
    {
      name: 'Methodologies',
      icon: '🔄',
      skills: [
        { name: 'Agile / Scrum', level: 5 },
        { name: 'Kanban', level: 4 },
        { name: 'CI/CD Workflows', level: 4 },
        { name: 'Code Reviews', level: 5 },
      ],
    },
    {
      name: 'DevOps & Infra',
      icon: '🚀',
      skills: [
        { name: 'Docker', level: 4 },
        { name: 'GitHub Actions', level: 4 },
        { name: 'Linux / Bash', level: 4 },
        { name: 'Railway / Render', level: 4 },
      ],
    },
  ];

  protected readonly tools = [
    'VS Code', 'Git / GitHub', 'Figma', 'Postman', 'DBeaver',
    'Prisma Studio', 'pnpm', 'ESLint', 'Prettier', 'Pino',
    'Zod', 'JWT', 'Helmet', 'Husky', 'Conventional Commits',
  ];

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Skills & Stack — Matias Garcia',
      description: 'Technical skills: Angular, TypeScript, Node.js, RxJS, NgRx, PostgreSQL, Microfrontends and more.',
    });
  }
}
