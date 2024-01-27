import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RegisterUserDto } from 'src/application/user/dto/register-user-dto';
import { UserDto } from 'src/application/user/dto/user-dto';
import { UserService } from 'src/application/user/user.service';
import { AuthGuard } from 'src/infrastructure/auth';
import { ExceptionDto } from 'src/infrastructure/exceptions';
import { LoginUserDto } from 'src/application/user/dto/login-user-dto';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiResponse({
  status: 422,
  description: 'Unexpected Error',
  type: ExceptionDto,
})
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiResponse({
    type: UserDto,
  })
  @Post('register')
  async RegisterUser(@Body() user: RegisterUserDto): Promise<UserDto> {
    return await this.userService.registerUser(user);
  }

  @ApiOkResponse({
    type: LoginUserDto,
  })
  @Post('login')
  async login(@Body() user: LoginUserDto): Promise<UserDto> {
    return await this.userService.loginUser(user);
  }
  
}
