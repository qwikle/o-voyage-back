import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/commons/token';

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
    const auth: JwtPayload = this.jwtService.verify(jwtToken);
    if (auth) {
      if (req.ip !== auth.ip) {
        return false;
      }
      req.auth = auth;
      return true;
    }
    return false;
  }
}
