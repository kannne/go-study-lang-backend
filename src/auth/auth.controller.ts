import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersDto } from '../users/dto/user.dto';

/**
 * Express Request에 user 프로퍼티를 추가한 타입
 * Passport.js가 인증 성공 시 req.user에 사용자 정보를 담음
 */
interface RequestWithUser extends Request {
  user: UsersDto;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Guard가 인증을 처리하므로 이 메서드는 비어 있음
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    // GoogleStrategy의 validate 메서드에서 반환한 user 객체가 req.user에 담김
    const { access_token } = this.authService.login(req.user);

    // 쿠키로 토큰 전달 및 프론트엔드 리다이렉트
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4040';
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
    });
    res.redirect(`${frontendUrl}/auth/callback`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
