import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { EmailAlreadyInUseError } from '@/services/errors/email-already-in-use-error';
import { makeRegistrationService } from '@/services/factories/make-register-service';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerService = makeRegistrationService();

    await registerService.execute({ name, email, password });
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({ error: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
