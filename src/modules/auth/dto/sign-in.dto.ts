import { ValidationMessages } from '@/modules/common/helpers/validation-messages';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsEmail({}, { message: ValidationMessages.isEmail })
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty })
  username: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty })
  password: string;
}
