import { hash } from 'bcryptjs';

import { UsersRepository } from '@/repositories/users-repository';
import { EmailAlreadyInUseError } from '@/errors/email-already-in-use-error';

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError();
    }

    const password_hash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
