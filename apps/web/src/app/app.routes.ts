import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
        title: 'Matias Garcia — Full Stack Engineer',
        data: { animation: 'home' },
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about.component').then((m) => m.AboutComponent),
        title: 'About — Matias Garcia',
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/experience/experience.component').then((m) => m.ExperienceComponent),
        title: 'Experience — Matias Garcia',
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/skills/skills.component').then((m) => m.SkillsComponent),
        title: 'Skills — Matias Garcia',
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/projects/projects-list/projects-list.component').then(
                (m) => m.ProjectsListComponent,
              ),
            title: 'Projects — Matias Garcia',
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/projects/project-detail/project-detail.component').then(
                (m) => m.ProjectDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'lab',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/lab/lab-list/lab-list.component').then((m) => m.LabListComponent),
            title: 'Lab & Experiments — Matias Garcia',
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/lab/lab-detail/lab-detail.component').then(
                (m) => m.LabDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'blog',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/blog/blog-list/blog-list.component').then(
                (m) => m.BlogListComponent,
              ),
            title: 'Blog — Matias Garcia',
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/blog/blog-detail/blog-detail.component').then(
                (m) => m.BlogDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
        title: 'Contact — Matias Garcia',
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        title: 'Dashboard — Admin',
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./features/admin/posts/posts-list/posts-list.component').then(
            (m) => m.AdminPostsListComponent,
          ),
        title: 'Posts — Admin',
      },
      {
        path: 'posts/new',
        loadComponent: () =>
          import('./features/admin/posts/post-editor/post-editor.component').then(
            (m) => m.PostEditorComponent,
          ),
        title: 'New Post — Admin',
      },
      {
        path: 'posts/:id/edit',
        loadComponent: () =>
          import('./features/admin/posts/post-editor/post-editor.component').then(
            (m) => m.PostEditorComponent,
          ),
        title: 'Edit Post — Admin',
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/admin/projects/admin-projects.component').then(
            (m) => m.AdminProjectsComponent,
          ),
        title: 'Projects — Admin',
      },
      {
        path: 'experiments',
        loadComponent: () =>
          import('./features/admin/experiments/admin-experiments.component').then(
            (m) => m.AdminExperimentsComponent,
          ),
        title: 'Experiments — Admin',
      },
      {
        path: 'experiences',
        loadComponent: () =>
          import('./features/admin/experiences/admin-experiences.component').then(
            (m) => m.AdminExperiencesComponent,
          ),
        title: 'Experiences — Admin',
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/admin/messages/admin-messages.component').then(
            (m) => m.AdminMessagesComponent,
          ),
        title: 'Messages — Admin',
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/login.component').then((m) => m.LoginComponent),
    title: 'Admin Login',
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: '404 — Not Found',
  },
];
