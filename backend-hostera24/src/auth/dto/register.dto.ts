import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalid' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Parola trebuie să aibă cel puțin 6 caractere' })
  parola: string;
}
