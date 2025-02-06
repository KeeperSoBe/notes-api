import { User } from '../../modules/users/user.schema';

export interface FindOneByIdParam {
  readonly id: string;
}

export interface AuthenticatedRequest extends Request {
  readonly user: User;
}
