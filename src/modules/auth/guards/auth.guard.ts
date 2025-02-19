import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthenticatedRequest } from '../../../shared/interfaces/request.interface';
import { User } from '../../users/user.schema';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public, if so allow the request.
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.jwtService.verifyAsync<User>(token, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });

      // Assign the verified user object to the request for later use in the requests lifecycle.
      Object.assign(request, { user });
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader({ headers }: Request): string | undefined {
    if (!headers) {
      return undefined;
    }
    const authorization = (headers as never as Record<string, string>)[
      'authorization'
    ];

    if (!authorization || typeof authorization !== 'string') {
      return undefined;
    }

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
