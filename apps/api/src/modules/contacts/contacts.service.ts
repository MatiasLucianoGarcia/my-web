import { prisma } from '../../lib/prisma.js';

export interface CreateContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactsService = {
  async create(data: CreateContactData) {
    return prisma.contact.create({ data });
  },

  async list() {
    return prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async markAsRead(id: string) {
    return prisma.contact.update({ where: { id }, data: { read: true } });
  },
};
