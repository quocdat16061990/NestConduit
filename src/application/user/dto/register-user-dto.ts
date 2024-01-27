import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  readonly username: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  readonly password: string;
}
