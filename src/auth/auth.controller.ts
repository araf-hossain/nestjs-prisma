// Flow of how the request is handled
// in Controller we get the request and send it to the service
// then service send -> Prisma -> Database -> Prisma -> Service -> Controller -> Client

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  singup(@Body() dto: AuthDto) {
    console.log({
      dto,
    });
    return this.authService.singup(dto);
  }

  @Post('signin')
  singin() {
    return this.authService.signin();
  }
}
