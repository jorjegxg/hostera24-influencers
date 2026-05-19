import { IsString, MinLength } from 'class-validator';

export class ScanCodQrDto {
  @IsString()
  @MinLength(1, { message: 'Conținutul scanat este gol' })
  payload: string;
}
