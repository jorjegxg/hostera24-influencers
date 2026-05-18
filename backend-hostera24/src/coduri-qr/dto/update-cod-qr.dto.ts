import { IsString, MinLength } from 'class-validator';

export class UpdateCodQrDto {
  @IsString()
  @MinLength(1, { message: 'Descrierea pentru client este obligatorie' })
  numePostareClienti: string;

  @IsString()
  @MinLength(1, { message: 'Descrierea pentru firmă este obligatorie' })
  numePostareFirme: string;
}
