import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAngajatDto {
  @IsEmail({}, { message: 'Email invalid' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nume?: string;
}
