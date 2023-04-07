import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateService = makeAuthenticateService();

    const { user } = await authenticateService.execute({ email, password });

    const token = await reply.jwtSign(
      {},
      {
        sub: user.id,
      }
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sub: user.id,
        expiresIn: '7d',
      }
    );

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ error: error.message });
    }

    throw error;
  }
}
