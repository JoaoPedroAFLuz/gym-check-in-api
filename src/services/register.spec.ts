import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { EmailAlreadyInUseError } from '@/services/errors/email-already-in-use-error';
import { RegisterService } from '@/services/register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterService;

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterService(usersRepository);
  });

  it('should be able to register an user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
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
    const email = 'johndoe@example.com';

    await sut.execute({
      name: 'John Doe',
      email,
      password: '12345678',
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });
});
