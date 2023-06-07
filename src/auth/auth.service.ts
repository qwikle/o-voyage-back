import { Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/signUpInput'; 
import { UpdateAuthInput } from './dto/update-auth.input'
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

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
