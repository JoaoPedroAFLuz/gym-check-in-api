import { hash } from 'bcryptjs';
import { beforeAll, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { GetUserProfileService } from './get-user-profile';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe('Get User Profile Service', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user).toEqual(createdUser);
  });

  it('should be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
