// ─── ENUMS ──────────────────────────────────────────────────────────────────

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export enum ExperimentStatus {
  IDEA = 'IDEA',
  WIP = 'WIP',
  DONE = 'DONE',
  PAUSED = 'PAUSED',
}

// ─── PAGINATION ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── API RESPONSE ────────────────────────────────────────────────────────────

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ─── USER ────────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: string;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokenDto {
  accessToken: string;
  user: UserDto;
}

// ─── TAG ─────────────────────────────────────────────────────────────────────

export interface TagDto {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

// ─── CATEGORY ────────────────────────────────────────────────────────────────

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

// ─── POST ────────────────────────────────────────────────────────────────────

export interface PostDto {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: PostStatus;
  featured: boolean;
  readingTime?: number | null;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  author: UserDto;
  category?: CategoryDto | null;
  tags: TagDto[];
  relatedPosts?: PostListItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PostListItemDto {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  status: PostStatus;
  featured: boolean;
  readingTime?: number | null;
  publishedAt?: string | null;
  category?: CategoryDto | null;
  tags: TagDto[];
  author: Pick<UserDto, 'id' | 'name' | 'avatarUrl'>;
  createdAt: string;
}

export interface CreatePostDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status?: PostStatus;
  featured?: boolean;
  categoryId?: string;
  tagIds?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  publishedAt?: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export interface PostQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
  status?: PostStatus;
}

// ─── PROJECT ─────────────────────────────────────────────────────────────────

export interface ProjectDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  coverImage?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  featured: boolean;
  status: string;
  stack: string[];
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  slug: string;
  description: string;
  content?: string;
  coverImage?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  status?: string;
  stack?: string[];
  tags?: string[];
  order?: number;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

// ─── EXPERIMENT ──────────────────────────────────────────────────────────────

export interface ExperimentDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ExperimentStatus;
  stack: string[];
  tags: string[];
  demoUrl?: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperimentDto {
  title: string;
  slug: string;
  description: string;
  status?: ExperimentStatus;
  stack?: string[];
  tags?: string[];
  demoUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface UpdateExperimentDto extends Partial<CreateExperimentDto> {}

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────

export interface ExperienceDto {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  logoUrl?: string | null;
  stack: string[];
  order: number;
}

export interface CreateExperienceDto {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  logoUrl?: string;
  stack?: string[];
  order?: number;
}

export interface UpdateExperienceDto extends Partial<CreateExperienceDto> {}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

export interface CreateContactDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactDto {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
