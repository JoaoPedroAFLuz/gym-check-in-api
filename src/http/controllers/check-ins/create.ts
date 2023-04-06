import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { MaxDistanceError } from '@/services/errors/max-distance-error';
import { makeCheckInService } from '@/services/factories/make-check-in-service';
import { MaxNumberOfCheckInsError } from '@/services/errors/max-number-of-check-ins';
import { ResourceNotFoundError } from '@/services/errors/resource-not-found';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  try {
    const { gymId } = createCheckInParamsSchema.parse(request.params);

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

    const createGymService = makeCheckInService();

    const { checkIn } = await createGymService.execute({
      userId: request.user.sub,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return reply.status(201).send({ checkIn });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (
      error instanceof MaxDistanceError ||
      error instanceof MaxNumberOfCheckInsError
    ) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
