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
  async googleLoginCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    // GoogleStrategy의 validate 메서드에서 반환한 user 객체가 req.user에 담김
    const { access_token, refresh_token } = await this.authService.login(req.user);

    // 쿠키로 토큰 전달
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4040';
    const isProduction = process.env.NODE_ENV === 'production';

    // Access Token 쿠키 (1시간)
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    // Refresh Token 쿠키 (7일)
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 604800000,
    });

    res.redirect(`${frontendUrl}/auth/callback`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  /**
   * Refresh Token으로 Access Token 재발급
   * Refresh Token Rotation: 매번 새로운 Refresh Token 발급
   */
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies?.['refresh_token'] as string | undefined;

    if (!refresh_token || typeof refresh_token !== 'string') {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    try {
      const { access_token, refresh_token: new_refresh_token, user } =
        await this.authService.refreshAccessToken(refresh_token);

      const isProduction = process.env.NODE_ENV === 'production';

      // 새 Access Token 쿠키 설정
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 3600000,
      });

      // 새 Refresh Token 쿠키 설정 (Rotation)
      res.cookie('refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 604800000,
      });

      return res.json({ message: 'Token refreshed', user });
    } catch {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }

  /**
   * 로그아웃 (Refresh Token 무효화 및 쿠키 삭제)
   */
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies?.['refresh_token'] as string | undefined;

    if (refresh_token && typeof refresh_token === 'string') {
      // DB에서 Refresh Token 삭제
      await this.authService.revokeRefreshToken(refresh_token);
    }

    // 쿠키 삭제
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.json({ message: 'Logged out successfully' });
  }
}
