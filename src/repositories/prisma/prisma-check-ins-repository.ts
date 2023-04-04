import { CheckIn, Prisma } from '@prisma/client';

import { CheckInsRepository } from '../check-in-repository';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    return checkIns;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfOfTheDay = dayjs(date).endOf('date');

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfOfTheDay.toDate(),
        },
      },
    });

    return checkIn;
  }

  async countByUserId(userId: string) {
    const checkIns = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return checkIns;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkIn;
  }
}
