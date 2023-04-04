import { FindManyNearbyParams } from './../gyms-repository';
import { randomUUID } from 'node:crypto';

import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-cordinates';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );

      return distance < 10;
    });

    return gyms;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.items
      .filter((item) => {
        const queryInLowerCase = query.toLowerCase();
        const itemTitleInLowerCase = item.title.toLowerCase();

        return itemTitleInLowerCase.includes(queryInLowerCase);
      })
      .slice((page - 1) * 20, page * 20);

    return gyms;
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };

    this.items.push(gym);

    return gym;
  }
}
