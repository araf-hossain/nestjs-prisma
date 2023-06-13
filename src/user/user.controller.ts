import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  // @UseGuards by default use the 'jwt' AuthGuard.
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
