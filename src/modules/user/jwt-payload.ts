import { User } from './user.model';

export interface JwtPayload {
  userId: User['id'];
}
