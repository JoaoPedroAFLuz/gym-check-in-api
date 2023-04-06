import { makeFetchNearbyService } from '@/services/factories/make-fetch-nearby-service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const fetchGymsNearbyQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = fetchGymsNearbyQuerySchema.parse(
    request.query
  );

  const fetchGymsNearbyService = makeFetchNearbyService();

  const { gyms } = await fetchGymsNearbyService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ gyms });
}
