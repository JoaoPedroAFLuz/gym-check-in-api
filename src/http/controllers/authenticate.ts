import { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateService } from '@/services/authenticate';
import { z } from 'zod';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';

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
    const usersRepository = new PrismaUsersRepository();
    const authenticateService = new AuthenticateService(usersRepository);

    await authenticateService.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ error: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}
