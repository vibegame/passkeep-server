import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

class Field {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateClueDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Field)
  @ArrayMinSize(1)
  fields: Field[];
}
