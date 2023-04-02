import { compare, hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    });

    const isPasswordCorrectlyHashed = await compare(
      '12345678',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to authenticate a non registered user', async () => {
    await expect(() =>
      sut.execute({
        email: 'john@example.com',
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong e-mail', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'john@example.com',
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '87654321',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
