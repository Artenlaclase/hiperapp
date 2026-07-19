import { Controller, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) return { error: 'Email already registered' };
    const user = await this.usersService.createUser(dto as any);
    return { id: user.id, email: user.email, name: user.name };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) return { error: 'Invalid credentials' };
    const valid = await this.authService.validateUser(dto.email, dto.password);
    if (!valid) return { error: 'Invalid credentials' };
    const tokens = await this.authService.login(user);
    // Set refresh token as httpOnly cookie; access token returned in body
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.sub);
    return { ok: true };
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Body() body: { userId: number; refreshToken?: string }, @Res({ passthrough: true }) res: Response) {
    // Prefer refresh token from httpOnly cookie; fall back to body
    let refreshToken = body?.refreshToken
    const cookieHeader = req.headers?.cookie || ''
    if (!refreshToken && cookieHeader) {
      const match = cookieHeader.split(';').map(s=>s.trim()).find(s=>s.startsWith('refreshToken='))
      if (match) refreshToken = match.split('=')[1]
    }
    const userId = body?.userId
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: tokens.accessToken };
  }
}
