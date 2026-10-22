import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../jwt.strategy.js';

@Injectable()
export class AdminGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const authenticated = await super.canActivate(context);

    if (!authenticated) {
      throw new UnauthorizedException();
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user: JwtPayload }>();

    if (request.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Admin access required',
      );
    }

    return true;
  }
}