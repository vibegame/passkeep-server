import { IsString } from 'class-validator';
import { IsPartial } from 'src/helpers/class-validator/is-partial';

export class UpdateFieldDto {
  @IsPartial()
  @IsString()
  name?: string;

  @IsPartial()
  @IsString()
  value?: string;
}
