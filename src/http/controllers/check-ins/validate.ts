import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { LateCheckInValidationError } from '@/services/errors/late-check-in-validation-error';
import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  try {
    const validateCheckInService = makeValidateCheckInService();

    await validateCheckInService.execute({
      checkInId,
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof LateCheckInValidationError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
