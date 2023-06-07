import { Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.Input';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/commons/configuration';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  createUser(signUpInput: SignUpInput) {
    const user = this.userRepository.create({ ...signUpInput });
    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all auth`;
  }

  // TODO: add role to token
  async generateToken(user: User, ip: string) {
    const accessToken = await this.jwtService.signAsync({ id: user.id, ip });
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id, ip },
      {
        secret: configuration().jwtRefreshSecret,
        expiresIn: '7d',
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
