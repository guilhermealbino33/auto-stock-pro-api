import { ValidationMessages } from '@/modules/common/helpers/validation-messages';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignOutDTO {
  @IsEmail({}, { message: ValidationMessages.isEmail })
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty })
  username: string;
}
