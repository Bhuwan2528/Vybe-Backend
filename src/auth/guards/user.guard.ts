import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserGuard
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

    if (request.user.role !== 'USER') {
      throw new ForbiddenException(
        'This route is available to normal users only',
      );
    }

    return true;
  }
}