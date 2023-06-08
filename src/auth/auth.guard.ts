import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    if (!req.headers['authorization']) {
      return false;
    }
    const jwtToken = req.headers['authorization'].split(' ')[1];
    const user = this.jwtService.verify(jwtToken);
    if (user) {
      if (req.ip !== user.ip) {
        return false;
      }
      return true;
    }
    return false;
  }
}
