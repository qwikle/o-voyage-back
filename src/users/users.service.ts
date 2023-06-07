import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoaderService } from 'src/commons/dataloader';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private loaderService: LoaderService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const user = this.userRepository.create({ ...createUserInput });
    await this.userRepository.save(user);
    return user;
  }

  findAll() {
    return this.userRepository.find({
      relations: {
        role: true,
      },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id, role: true });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      // todo replace null by throw graphql error
      return null;
    }
    return this.userRepository.merge(user, { ...updateUserInput });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
