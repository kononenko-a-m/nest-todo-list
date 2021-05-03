import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.model';
import { UserNotExistsError } from './error/user-not-exists-error';
import { PasswordNotMatchError } from './error/password-not-match-error';
import { UserAlreadyExistsError } from './error/user-already-exists-error';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TokenInformationDto } from './dto/token-information.dto';
import { ApiAuthorizationHeaderDecorator } from './api-authorization-header.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign-in')
  @ApiOkResponse({
    type: TokenInformationDto,
  })
  @ApiNotFoundResponse({
    description: 'The user with such email and/or password does not exists.',
  })
  async postSignIn(@Body() signInRequest: SignInRequestDto) {
    try {
      return await this.userService.signIn(signInRequest);
    } catch (e) {
      if (
        e instanceof UserNotExistsError ||
        e instanceof PasswordNotMatchError
      ) {
        throw new HttpException(
          { error: 'USER_NOT_FOUND' },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  @Post('/sign-up')
  @ApiCreatedResponse({
    description: 'The user has been successfully signed up.',
  })
  @ApiConflictResponse({
    description: 'The user with such email already signed up.',
  })
  async postSignUp(@Body() signUpRequestDto: SignUpRequestDto) {
    try {
      return await this.userService.signUp(signUpRequestDto);
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        throw new HttpException(
          { error: 'USER_ALREADY_EXISTS' },
          HttpStatus.CONFLICT,
        );
      } else {
        throw e;
      }
    }
  }

  @Post('/token')
  @ApiAuthorizationHeaderDecorator()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: TokenInformationDto,
  })
  refreshToken(@CurrentUser() currentUser: User) {
    return this.userService.refreshToken(currentUser);
  }

  @Get(':userId')
  @ApiAuthorizationHeaderDecorator()
  @ApiForbiddenResponse({
    description: 'Current user has no access to details of the requested user',
  })
  @ApiOkResponse({
    description: 'Return user details',
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  getUserDetails(
    @CurrentUser() currentUser: User,
    @Param('userId') userId: User['id'],
  ) {
    return this.userService.getUserDetailsByAnotherUser(currentUser, userId);
  }
}
