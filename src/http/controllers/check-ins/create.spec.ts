import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Check in (e2e)', async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to check in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'TypeScript Gym',
        description: null,
        phone: null,
        latitude: -14.876764449163613,
        longitude: -40.81731171746395,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -14.876764449163613,
        longitude: -40.81731171746395,
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.checkIn).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    );
  });
});
