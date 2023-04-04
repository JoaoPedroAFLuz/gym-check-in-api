import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository-in-memory';
import { FetchNearbyGymsService } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe('Fetch Nearby Gyms Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -14.876764449163613,
      longitude: -40.81731171746395,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -12.976795992705295,
      longitude: -38.45553303331036,
    });

    const { gyms } = await sut.execute({
      userLatitude: -14.876764449163613,
      userLongitude: -40.81731171746395,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
