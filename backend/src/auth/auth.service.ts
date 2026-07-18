import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
    await this.usersService.setRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const isValid = await this.usersService.validateRefreshToken(userId, refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');
    const user = await this.usersService.findById(userId);
    const tokens = await this.login(user);
    return tokens;
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return true;
  }
}
