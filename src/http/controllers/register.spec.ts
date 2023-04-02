import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { EmailAlreadyInUseError } from '@/services/errors/email-already-in-use-error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RegisterService } from '@/services/register';

describe('Register Service', () => {
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    const isPasswordCorrectlyHashed = await compare(
      '12345678',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register an user with an e-mail already in use', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const email = 'johndoe@example.com';

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '12345678',
    });

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it('should not be able to register an user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
