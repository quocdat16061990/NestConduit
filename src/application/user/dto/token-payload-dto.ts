import { User } from 'src/domain/entities/user';

export interface TokenPayloadDto {
  user: Pick<User, 'id' | 'username' | 'email'>;
}
