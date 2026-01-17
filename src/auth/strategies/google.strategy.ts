import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4041/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { _json: { sub: string; email: string; picture: string } },
  ) {
    const { sub, email, picture } = profile._json;
    const loginUser = {
      email,
      googleId: sub,
      picture,
    };

    // validateGoogleUser가 User를 찾거나 생성하고 반환함
    const user = await this.authService.validateGoogleUser(loginUser);
    return user;
  }
}
