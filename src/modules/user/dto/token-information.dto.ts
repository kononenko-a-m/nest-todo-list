import { ApiProperty } from '@nestjs/swagger';

export class TokenInformationDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expiresIn: string;

  constructor(accessToken: string, expiresIn: string) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
  }
}
