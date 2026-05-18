import { IsString, MinLength } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @MinLength(10, { message: 'Token Google invalid' })
  idToken: string;
}
