import { Logger, Scope, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/domain/entities/user';
import { EnvironmentConfiguration } from '../enviroment-config';
import { IAuthService } from './auth.service.interface';
import { TokenPayloadDto } from 'src/application/user/dto/token-payload-dto';

@Injectable({
  scope: Scope.REQUEST,
})
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);
  private currentUser: Pick<User, 'id' | 'username' | 'email'> | null;
  private currentToken: string | null;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentConfiguration>,
  ) {}
  getCurrentUser(): Pick<User, 'id' | 'username' | 'email'> | null {
    return this.currentUser;
  }
  getCurrentToken(): string {
    return this.currentToken;
  }
  async generateAccessToken(user: User): Promise<string> {
    const accessToken = await this.jwtService.signAsync({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
    return accessToken;
  }
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync<TokenPayloadDto>(token, {
        secret: this.configService.get('jwtSecret'),
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
  async getCurrentUserInfo(token: string | undefined): Promise<void> {
    if (!token) {
      this.currentUser = null;
      this.currentToken = null;
      return;
    }
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        token,
        { secret: this.configService.get('jwtSecret') },
      );
    } catch (error) {
      this.logger.error(error);
      this.currentUser = null;
      this.currentToken = null;
    }
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async validatePassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashPassword);
    return isMatch;
  }
}
