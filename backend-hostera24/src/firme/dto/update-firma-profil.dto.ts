import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFirmaProfilDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nume?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  telefon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descriere?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  logoUrl?: string;
}
