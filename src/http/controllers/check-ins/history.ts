import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-check-ins-history-service';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const historyQuerySchema = z.object({
    page: z.coerce.number().default(1),
  });

  const { page } = historyQuerySchema.parse(request.query);

  const userCheckInsHistoryService = makeFetchUserCheckInsHistoryService();

  const { checkIns } = await userCheckInsHistoryService.execute({
    userId: request.user.sub,
    page,
  });

  reply.send({ checkIns });
}
