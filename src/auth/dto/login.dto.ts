import { IsBoolean, IsString } from 'class-validator';
import { IsPartial } from 'src/helpers/class-validator/is-partial';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsPartial()
  @IsBoolean()
  trustMe?: boolean;
}
