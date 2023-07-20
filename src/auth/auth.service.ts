import { Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.Input';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/commons/configuration';
import { UpdateAccountInput } from './dto/update-account-input';
import { ConfirmationFieldError } from 'src/commons/exceptions/confirmation.field';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  createUser(signUpInput: SignUpInput) {
    const user = this.userRepository.create(signUpInput);
    return this.userRepository.save(user);
  }

  async generateToken(user: User, ip: string) {
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      ip,
      role: user.roleId,
    });
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id, ip },
      {
        secret: configuration().jwtRefreshSecret,
        expiresIn: '7d',
      },
    );
    return {
      accessToken: 'bearer ' + accessToken,
      refreshToken,
    };
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async deleteAccount(user: User) {
    await this.userRepository.delete(user.id);
    return true;
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: configuration().jwtRefreshSecret,
    });
  }

  updateAccount(user: User, updateAccountInput: UpdateAccountInput) {
    user = this.userRepository.merge(user, { ...updateAccountInput });
    return this.userRepository.save(user);
  }

  checkPassword(password?: string, confirmPassword?: string) {
    if (password) {
      if (password !== confirmPassword) {
        throw new ConfirmationFieldError('confirmPassword');
      }
    }
  }
}
