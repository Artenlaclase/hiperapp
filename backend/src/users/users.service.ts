import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { name: string; email: string; password: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data: { name: data.name, email: data.email, password: hashed } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async setRefreshToken(userId: number, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    return this.prisma.user.update({ where: { id: userId }, data: { refreshToken: hashed } });
  }

  async removeRefreshToken(userId: number) {
    return this.prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }

  async validateRefreshToken(userId: number, token: string) {
    const user = await this.findById(userId);
    if (!user || !user.refreshToken) return false;
    return bcrypt.compare(token, user.refreshToken);
  }
}
