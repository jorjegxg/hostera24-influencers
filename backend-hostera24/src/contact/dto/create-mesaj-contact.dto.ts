import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMesajContactDto {
  @IsIn(['contact'])
  tip: 'contact';

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  nume: string;

  @IsEmail({}, { message: 'Email invalid' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  telefon: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  agentie?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  mesaj?: string;
}
