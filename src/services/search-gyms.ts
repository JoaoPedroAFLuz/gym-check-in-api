import { Gym } from '@prisma/client';

import { GymsRepository } from '@/repositories/gyms-repository';

interface SearchGymsServiceRequest {
  name: string;
  page: number;
}

interface SearchGymsServiceResponse {
  gyms: Gym[];
}

export class SearchGymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    name,
    page,
  }: SearchGymsServiceRequest): Promise<SearchGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchMany(name, page);

    return { gyms };
  }
}
