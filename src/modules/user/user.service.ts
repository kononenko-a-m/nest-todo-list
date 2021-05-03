import { Injectable } from '@nestjs/common';
import { hash, verify, argon2id } from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { UserNotExistsError } from './error/user-not-exists-error';
import { PasswordNotMatchError } from './error/password-not-match-error';
import { User } from './user.model';
import { JwtPayload } from './jwt-payload';
import { TokenInformationDto } from './dto/token-information.dto';
import { NoAccessError } from '../../common/security/error';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {}

  async signIn({
    password,
    email,
  }: SignInRequestDto): Promise<TokenInformationDto> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new UserNotExistsError(email);
    }

    const userPasswordHash = await this.userRepository.getUserPassword(user);

    if (!(await verify(userPasswordHash, password, this.hashOptions()))) {
      throw new PasswordNotMatchError(email);
    }

    return this.issueToken(user);
  }

  async signUp({ password, email, name }: SignUpRequestDto): Promise<boolean> {
    const hashedPassword = await hash(password, this.hashOptions());
    await this.userRepository.createUserWithPassword(
      { email, name },
      hashedPassword,
    );

    return true;
  }

  refreshToken(user: User): Promise<TokenInformationDto> {
    return Promise.resolve(this.issueToken(user));
  }

  getUserDetailsByAnotherUser(
    subjectUser: User,
    userId: User['id'],
  ): Promise<User> {
    if (subjectUser.id !== userId) {
      throw new NoAccessError(
        String(subjectUser.id),
        `get details about user ${userId}`,
      );
    }

    return this.getUserById(userId);
  }

  getUserById(userId: User['id']) {
    return this.userRepository.getUserById(userId);
  }

  private issueToken(user: User): TokenInformationDto {
    const accessToken = this.jwtService.sign(this.createJwtPayload(user));

    return new TokenInformationDto(
      accessToken,
      this.configService.get<string>('authorization.jwt.signOptions.expiresIn'),
    );
  }

  private createJwtPayload(user: User): JwtPayload {
    return {
      userId: user.id,
    };
  }

  private hashOptions() {
    return {
      secret: Buffer.from(
        this.configService.get<string>('authorization.passwordSecret'),
      ),
      type: argon2id,
      version: 13, // the most up-to-date Argon2 version for now (23.02.2021)
    };
  }
}
