import { prisma } from '../../lib/prisma.js';
import { sendContactNotification } from './email.service.js';

export interface CreateContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactsService = {
  async create(data: CreateContactData) {
    // 1. Save to DB (source of truth)
    const contact = await prisma.contact.create({ data });

    // 2. Send email notification (best-effort, won't fail the request)
    void sendContactNotification(data);

    return contact;
  },

  async list() {
    return prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async markAsRead(id: string) {
    return prisma.contact.update({ where: { id }, data: { read: true } });
  },
};

