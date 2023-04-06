import { CheckIn } from '@prisma/client';
import dayjs from 'dayjs';

import { CheckInsRepository } from '@/repositories/check-in-repository';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const timeElapsedInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (timeElapsedInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
