import { Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/signUpInput';
import { User } from 'src/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  createUser(signUpInput: SignUpInput) {
    const user = this.userRepository.create({ ...signUpInput });
    return this.userRepository.save(user);
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
