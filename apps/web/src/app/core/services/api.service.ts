/**
 * @deprecated Use feature-specific services instead:
 * - PostsService     → core/services/posts.service
 * - ProjectsService  → core/services/projects.service
 * - ExperimentsService → core/services/experiments.service
 * - ExperiencesService → core/services/experiences.service
 * - ContactsService  → core/services/contacts.service
 * - TaxonomyService  → core/services/taxonomy.service
 *
 * This facade is kept for backwards compatibility during migration.
 */
import { inject, Injectable } from '@angular/core';
import { PostsService } from './posts.service';
import { ProjectsService } from './projects.service';
import { ExperimentsService } from './experiments.service';
import { ExperiencesService } from './experiences.service';
import { ContactsService } from './contacts.service';
import { TaxonomyService } from './taxonomy.service';
import type { PostQueryDto, CreatePostDto, UpdatePostDto, CreateProjectDto, UpdateProjectDto, CreateExperimentDto, UpdateExperimentDto, CreateExperienceDto, UpdateExperienceDto, CreateContactDto } from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly posts = inject(PostsService);
  private readonly projects = inject(ProjectsService);
  private readonly experiments = inject(ExperimentsService);
  private readonly experiences = inject(ExperiencesService);
  private readonly contacts = inject(ContactsService);
  private readonly taxonomy = inject(TaxonomyService);

  // Posts
  getPosts(query: PostQueryDto = {}) { return this.posts.getAll(query); }
  getAdminPosts(query: PostQueryDto = {}) { return this.posts.getAllAdmin(query); }
  getPostBySlug(slug: string) { return this.posts.getBySlug(slug); }
  createPost(data: CreatePostDto) { return this.posts.create(data); }
  updatePost(id: string, data: UpdatePostDto) { return this.posts.update(id, data); }
  deletePost(id: string) { return this.posts.delete(id); }

  // Projects
  getProjects() { return this.projects.getAll(); }
  getProjectBySlug(slug: string) { return this.projects.getBySlug(slug); }
  createProject(data: CreateProjectDto) { return this.projects.create(data); }
  updateProject(id: string, data: UpdateProjectDto) { return this.projects.update(id, data); }
  deleteProject(id: string) { return this.projects.delete(id); }

  // Experiments
  getExperiments() { return this.experiments.getAll(); }
  getExperimentBySlug(slug: string) { return this.experiments.getBySlug(slug); }
  createExperiment(data: CreateExperimentDto) { return this.experiments.create(data); }
  updateExperiment(id: string, data: UpdateExperimentDto) { return this.experiments.update(id, data); }
  deleteExperiment(id: string) { return this.experiments.delete(id); }

  // Experiences
  getExperiences() { return this.experiences.getAll(); }
  createExperience(data: CreateExperienceDto) { return this.experiences.create(data); }
  updateExperience(id: string, data: UpdateExperienceDto) { return this.experiences.update(id, data); }
  deleteExperience(id: string) { return this.experiences.delete(id); }

  // Taxonomy
  getTags() { return this.taxonomy.getTags(); }
  getCategories() { return this.taxonomy.getCategories(); }

  // Contacts
  sendContact(data: CreateContactDto) { return this.contacts.send(data); }
  getContacts() { return this.contacts.getAll(); }
  markContactRead(id: string) { return this.contacts.markAsRead(id); }
}
