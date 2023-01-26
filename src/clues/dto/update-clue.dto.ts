import { IsString } from 'class-validator';
import { IsPartial } from 'src/helpers/class-validator/is-partial';

export class UpdateClueDto {
  @IsPartial()
  @IsString()
  name?: string;
}
