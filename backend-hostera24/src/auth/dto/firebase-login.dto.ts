import { IsString, MinLength } from 'class-validator';

export class FirebaseLoginDto {
  @IsString()
  @MinLength(20, { message: 'Token Firebase invalid' })
  idToken: string;
}
