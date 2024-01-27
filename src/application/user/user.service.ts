import {
  BadRequestException,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user-dto';
import { UserDto } from './dto/user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user-dto';
import { IAuthService, AuthInjectionToken } from 'src/infrastructure/auth';
import { RepositoryInjectionToken } from 'src/domain/repository/repository.injection-token';
import { IRepository } from 'src/domain/repository/repository.interface';
@Injectable()
export class UserService {
  constructor(
    @Inject(RepositoryInjectionToken.User)
    private userRepository: IRepository<User>,
    @Inject(AuthInjectionToken)
    private authService: IAuthService,
  ) {}
  async registerUser(request: RegisterUserDto): Promise<UserDto> {
    const userValidate = await this.userRepository.findOne({
      where: [
        { username: request.username },
        { email: request.email },
        { password: request.password },
      ],
    });
    if (userValidate) {
      throw new BadRequestException(['Username and email must be unique']);
    }
    const newUser = await this.userRepository.save({
      ...request,
      password: await this.authService.hashPassword(request.password),
    });
    return {
      username: newUser.username,
      bio: newUser.bio,
      image: newUser.image,
      token: await this.authService.generateAccessToken(newUser),
      email: newUser.email,
    };
  }
  async loginUser(request: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: [
        {
          email: request.email,
        },
      ],
    });
    if (!user) {
      throw new UnauthorizedException(['Email is not exits']);
    }
    const isValidPassword = await this.authService.validatePassword(
      request.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException(['Password is incorrect']);
    }
    const accessToken = await this.authService.generateAccessToken(user);
    return {
      bio: user.bio,
      email: user.email,
      image: user.image,
      username: user.username,
      token: accessToken,
    };
  }

}
