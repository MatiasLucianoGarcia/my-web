import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type {
  PostListItemDto,
  PostDto,
  PaginatedResponse,
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  ProjectDto,
  CreateProjectDto,
  UpdateProjectDto,
  ExperimentDto,
  CreateExperimentDto,
  UpdateExperimentDto,
  ExperienceDto,
  CreateExperienceDto,
  UpdateExperienceDto,
  CategoryDto,
  TagDto,
  ContactDto,
  CreateContactDto,
  ApiResponse,
} from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  // ─── POSTS ──────────────────────────────────────────────────────────────

  getPosts(query: PostQueryDto = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<PaginatedResponse<PostListItemDto>>>(`${this.base}/posts`, { params });
  }

  getAdminPosts(query: PostQueryDto = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<PaginatedResponse<PostListItemDto>>>(`${this.base}/posts/admin`, { params });
  }

  getPostBySlug(slug: string) {
    return this.http.get<ApiResponse<PostDto>>(`${this.base}/posts/${slug}`);
  }

  createPost(data: CreatePostDto) {
    return this.http.post<ApiResponse<PostDto>>(`${this.base}/posts`, data);
  }

  updatePost(id: string, data: UpdatePostDto) {
    return this.http.put<ApiResponse<PostDto>>(`${this.base}/posts/${id}`, data);
  }

  deletePost(id: string) {
    return this.http.delete<ApiResponse>(`${this.base}/posts/${id}`);
  }

  // ─── PROJECTS ────────────────────────────────────────────────────────────

  getProjects() {
    return this.http.get<ApiResponse<ProjectDto[]>>(`${this.base}/projects`);
  }

  getProjectBySlug(slug: string) {
    return this.http.get<ApiResponse<ProjectDto>>(`${this.base}/projects/${slug}`);
  }

  createProject(data: CreateProjectDto) {
    return this.http.post<ApiResponse<ProjectDto>>(`${this.base}/projects`, data);
  }

  updateProject(id: string, data: UpdateProjectDto) {
    return this.http.put<ApiResponse<ProjectDto>>(`${this.base}/projects/${id}`, data);
  }

  deleteProject(id: string) {
    return this.http.delete<ApiResponse>(`${this.base}/projects/${id}`);
  }

  // ─── EXPERIMENTS ─────────────────────────────────────────────────────────

  getExperiments() {
    return this.http.get<ApiResponse<ExperimentDto[]>>(`${this.base}/experiments`);
  }

  getExperimentBySlug(slug: string) {
    return this.http.get<ApiResponse<ExperimentDto>>(`${this.base}/experiments/${slug}`);
  }

  createExperiment(data: CreateExperimentDto) {
    return this.http.post<ApiResponse<ExperimentDto>>(`${this.base}/experiments`, data);
  }

  updateExperiment(id: string, data: UpdateExperimentDto) {
    return this.http.put<ApiResponse<ExperimentDto>>(`${this.base}/experiments/${id}`, data);
  }

  deleteExperiment(id: string) {
    return this.http.delete<ApiResponse>(`${this.base}/experiments/${id}`);
  }

  // ─── EXPERIENCES ─────────────────────────────────────────────────────────

  getExperiences() {
    return this.http.get<ApiResponse<ExperienceDto[]>>(`${this.base}/experiences`);
  }

  createExperience(data: CreateExperienceDto) {
    return this.http.post<ApiResponse<ExperienceDto>>(`${this.base}/experiences`, data);
  }

  updateExperience(id: string, data: UpdateExperienceDto) {
    return this.http.put<ApiResponse<ExperienceDto>>(`${this.base}/experiences/${id}`, data);
  }

  deleteExperience(id: string) {
    return this.http.delete<ApiResponse>(`${this.base}/experiences/${id}`);
  }

  // ─── TAXONOMY ────────────────────────────────────────────────────────────

  getTags() {
    return this.http.get<ApiResponse<TagDto[]>>(`${this.base}/taxonomy/tags`);
  }

  getCategories() {
    return this.http.get<ApiResponse<CategoryDto[]>>(`${this.base}/taxonomy/categories`);
  }

  // ─── CONTACTS ────────────────────────────────────────────────────────────

  sendContact(data: CreateContactDto) {
    return this.http.post<ApiResponse>(`${this.base}/contacts`, data);
  }

  getContacts() {
    return this.http.get<ApiResponse<ContactDto[]>>(`${this.base}/contacts`);
  }

  markContactRead(id: string) {
    return this.http.put<ApiResponse>(`${this.base}/contacts/${id}/read`, {});
  }
}
