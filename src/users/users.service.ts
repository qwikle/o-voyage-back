import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  createUser(createUserInput: CreateUserInput) {
    const user = new User();
    user.email = createUserInput.email;
    user.firstname = createUserInput.firstname;
    user.lastname = createUserInput.lastname;
    user.password = createUserInput.password;
    user.confirmPassword = createUserInput.confirmPassword;
    user.isBanned = createUserInput.isBanned;
    user.role_id = createUserInput.role_id;
    return user.save();
  }

  async findAllUsers(): Promise<User[]> {
    return await User.find(); 
  }

  async findOne(id: number) {
    return await User.findOne(id);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return User.update(id, updateUserInput);
  }

  remove(id: number) {
    return User.delete(id);
  }
}
