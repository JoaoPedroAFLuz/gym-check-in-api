import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsService } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsService;

describe('Get User Metrics Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsService(checkInsRepository);
  });

  it('should be able to get check-ins count metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    });

    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(2);
  });
});
