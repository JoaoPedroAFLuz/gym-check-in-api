import { CheckIn, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { CheckInsRepository } from '../check-in-repository';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findById(id: string) {
    const checkIn = this.items.find((checkIn) => checkIn.id === id);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);

    return checkIns;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfOfTheDay = dayjs(date).endOf('date');

    const checkIn = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) &&
        checkInDate.isBefore(endOfOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async countByUserId(userId: string) {
    const checkIns = this.items.filter(
      (checkIn) => checkIn.user_id === userId
    ).length;

    return checkIns;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

    if (checkInIndex !== -1) {
      this.items[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
