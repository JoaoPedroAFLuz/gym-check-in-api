import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository-in-memory';
import { CreateGymService } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymsRepository);
  });

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'gym-01',
      description: null,
      phone: null,
      latitude: -14.8765089,
      longitude: -40.8091836,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
