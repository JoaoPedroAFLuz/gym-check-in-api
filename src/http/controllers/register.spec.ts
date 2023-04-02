import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { RegisterService } from '@/services/register';

describe('Register Service', () => {
  it('should hash user password upon registration', async () => {
    const registerService = new RegisterService({
      async findByEmail() {
        return null;
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        };
      },
    });

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
});
