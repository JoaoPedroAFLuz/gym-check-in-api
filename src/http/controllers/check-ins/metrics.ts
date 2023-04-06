import { FastifyReply, FastifyRequest } from 'fastify';

import { makeGetUserMetricsService } from '@/services/factories/make-get-user-metrics-service';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userCheckInsHistoryService = makeGetUserMetricsService();

  const { checkInsCount } = await userCheckInsHistoryService.execute({
    userId: request.user.sub,
  });

  reply.send({ checkInsCount });
}
