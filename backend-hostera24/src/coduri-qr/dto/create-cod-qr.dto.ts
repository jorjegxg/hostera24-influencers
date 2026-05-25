import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateCodQrDto {
  @IsOptional()
  @IsString()
  numePostareClienti?: string;

  @IsOptional()
  @IsString()
  numePostareFirme?: string;

  /** Preț serviciu / produs (lei). */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999_999.99)
  pret?: number;

  /** Reducere în lei. */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999_999.99)
  reducere?: number;

  @IsOptional()
  @IsIn(['interval', 'zile'])
  programareTip?: 'interval' | 'zile' | null;

  @ValidateIf((o: CreateCodQrDto) => o.programareTip === 'interval')
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  programareDeLa?: string;

  @ValidateIf((o: CreateCodQrDto) => o.programareTip === 'interval')
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  programarePanaLa?: string;

  @ValidateIf((o: CreateCodQrDto) => o.programareTip === 'zile')
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  programareZile?: number[];

  /** Număr maxim de scanări (reduceri). Lipsă = nelimitat. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(999_999)
  limitaScanari?: number | null;
}
