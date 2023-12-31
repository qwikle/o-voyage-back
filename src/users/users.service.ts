import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(user: User, updateUserInput: UpdateUserInput) {
    user = this.userRepository.merge(user, { ...updateUserInput });
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return true;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
