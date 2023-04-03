import { CheckIn } from '@prisma/client';

import { CheckInsRepository } from '@/repositories/check-in-repository';

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string;
}

interface FetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId);

    return {
      checkIns,
    };
  }
}
