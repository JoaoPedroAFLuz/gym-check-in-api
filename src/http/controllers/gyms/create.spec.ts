import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get crete a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gym = {
      title: 'Gym 01',
      description: null,
      phone: null,
      latitude: -14.876764449163613,
      longitude: -40.81731171746395,
    };

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gym);

    expect(response.statusCode).toEqual(201);
    expect(response.body.gym).toEqual(
      expect.objectContaining({ id: expect.any(String), title: 'Gym 01' })
    );
  });
});
