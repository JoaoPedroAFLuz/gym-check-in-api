import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterService } from '../register';

export function makeRegistrationService() {
  const usersRepository = new PrismaUsersRepository();
  const registrationService = new RegisterService(usersRepository);

  return registrationService;
}
