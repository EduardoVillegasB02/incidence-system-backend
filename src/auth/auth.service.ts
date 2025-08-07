import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(dto: LoginDto) {
    const { username, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
      },
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Credenciales inválidas');
    const { id, role } = user;
    return {
      user: { id, username, role },
      token: await this.getJwtToken({ sub: id, username, role }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
}
