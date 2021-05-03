import { Injectable } from '@nestjs/common';
import { KnexService } from '../../common/knex';
import { User } from './user.model';
import { DUPLICATE_KEY } from '../../common/knex/error-codes';
import { UserAlreadyExistsError } from './error/user-already-exists-error';

interface CreateUserDetails {
  name: string;
  email: string;
}

@Injectable()
export class UserRepository {
  static readonly USER_EMAIL_UNIQUE_CONSTRAINT = 'users_email_unique';
  static readonly USER_TABLE = 'users';
  static readonly SELECT_USER_RECORD_VIEW = {
    id: 'id',
    name: 'name',
    email: 'email',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  private static readonly USER_PASSWORDS_TABLE = 'user_passwords';

  constructor(private knexService: KnexService) {}

  createUserWithPassword(
    { name, email }: CreateUserDetails,
    password: string,
  ): Promise<number> {
    return this.knexService
      .getKnex()
      .transaction(async (trx) => {
        const userIds = await this.userTable()
          .transacting(trx)
          .insert({ name, email })
          .returning('id')
          .into(UserRepository.USER_TABLE);
        const userId = userIds[0];

        await this.userPasswordTable().transacting(trx).insert({
          user_id: userId,
          password,
        });

        return userId;
      })
      .catch((e) => {
        if (
          e.code === DUPLICATE_KEY &&
          e.constraint === UserRepository.USER_EMAIL_UNIQUE_CONSTRAINT
        ) {
          return Promise.reject(new UserAlreadyExistsError(email));
        } else {
          return Promise.reject(e);
        }
      });
  }

  async getUserById(id: number): Promise<User | undefined> {
    const userData = await this.userTable()
      .select(UserRepository.SELECT_USER_RECORD_VIEW)
      .where({ id })
      .then((records: User[]) => records[0]);

    return Object.assign(new User(), userData);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const userData = await this.userTable()
      .select(UserRepository.SELECT_USER_RECORD_VIEW)
      .where({ email })
      .then((records: User[]) => records[0]);

    return Object.assign(new User(), userData);
  }

  getUserPassword(user: User): Promise<string> {
    return this.userPasswordTable()
      .select('password')
      .where({
        user_id: user.id,
      })
      .then((records) => records[0].password);
  }

  private userTable() {
    return this.knexService.getKnex()(UserRepository.USER_TABLE);
  }

  private userPasswordTable() {
    return this.knexService.getKnex()(UserRepository.USER_PASSWORDS_TABLE);
  }
}
