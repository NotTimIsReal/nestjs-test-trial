import { UnAuthenticatedGuard } from '../guards/unauthenticated.guard';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { LocalGuard } from '../guards/local-auth.guard';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalGuard)
  @UseGuards(UnAuthenticatedGuard)
  @Post('login')
  getLogin(
    @Query('callback') callback: string,
    @Res() res: Response,
  ): string | void {
    return this.authService.getLogin(callback, res);
  }
  @UseGuards(AuthenticatedGuard)
  @Get('signout')
  getSignOut(@Req() req: Request) {
    return this.authService.getSignOut(req);
  }
}