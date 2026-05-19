import { IsOptional, IsString } from 'class-validator';

export class CreateCodQrDto {
  @IsOptional()
  @IsString()
  numePostareClienti?: string;

  @IsOptional()
  @IsString()
  numePostareFirme?: string;

  @IsOptional()
  @IsString()
  pretRedus?: string;
}
