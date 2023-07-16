import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  // @UseGuards by default use the 'jwt' AuthGuard.
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }
}
