import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async singup(dto: AuthDto) {
    // generate the password hash
    const passHash = await argon.hash(dto.password);

    try {
      // save the user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: passHash,
        },
      });

      // removing the password hash from the user object
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw new HttpException('Something wrong with email and password.', 500);
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    // if not found throw error
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Invalid Credentials');

    // compare the password
    // if not found throw error
    const hasPassword = await argon.verify(user.hash, dto.password);

    if (!hasPassword) throw new ForbiddenException('Invalid Credentials');

    // return user.
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token: token };
  }
}
