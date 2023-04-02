import { compare, hash } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticate Service', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    await expect(() =>
      sut.execute({
        email: 'john@example.com',
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong e-mail', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

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
