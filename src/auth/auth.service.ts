import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw new HttpException('Something wrong with email and password.', 500);
    }
  }

  signin(dto: AuthDto) {
    try {
      // find the user by email
      // if not found throw error

      // compare the password
      // if not found throw error

      // return user.
      return 'I am signed in';
    } catch (error) {
      throw new HttpException('Something wrong with email and password.', 500);
    }
  }
}
