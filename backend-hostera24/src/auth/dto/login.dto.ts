import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email invalid' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Parola este obligatorie' })
  parola: string;
}
