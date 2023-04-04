import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository-in-memory';
import { SearchGymsService } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe('Search Gyms Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymsRepository);
  });

  it('should be able to search for gyms by their names', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -14.8765089,
      longitude: -40.8091836,
    });

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -14.8765089,
      longitude: -40.8091836,
    });

    const { gyms } = await sut.execute({
      name: 'typescript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TypeScript Gym' }),
    ]);
  });

  it('should be able to search for a paginated list of gyms by their names', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -14.8765089,
        longitude: -40.8091836,
      });
    }

    const { gyms } = await sut.execute({
      name: 'javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ]);
  });
});
