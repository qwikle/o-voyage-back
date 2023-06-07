import { Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  // TODO: Implement this method
  generateToken(user: User) {
    return `This action returns a  auth`;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
