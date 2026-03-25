import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export interface CreateProjectData {
  title: string;
  slug: string;
  description: string;
  content?: string;
  coverImage?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status: string;
  stack: string[];
  tags: string[];
  order: number;
}

export type UpdateProjectData = Partial<CreateProjectData>;

export const ProjectsService = {
  async list() {
    return prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  },

  async findBySlug(slug: string) {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) throw new AppError(404, 'Project not found');
    return project;
  },

  async create(data: CreateProjectData) {
    return prisma.project.create({
      data: {
        ...data,
        coverImage: data.coverImage || null,
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
      },
    });
  },

  async update(id: string, data: UpdateProjectData) {
    return prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...(data.coverImage !== undefined && { coverImage: data.coverImage || null }),
        ...(data.liveUrl !== undefined && { liveUrl: data.liveUrl || null }),
        ...(data.repoUrl !== undefined && { repoUrl: data.repoUrl || null }),
      },
    });
  },

  async delete(id: string) {
    await prisma.project.delete({ where: { id } });
  },
};
