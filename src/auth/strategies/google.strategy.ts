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
      // TODO: TS에러 해결하기
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { _json: { sub: string; email: string; picture: string } },
  ): Promise<any> {
    try {
      const { sub, email, picture } = profile._json;
      const loginUser = {
        email: email,
        googleId: sub,
        picture: picture,
      };
      await this.authService.validateGoogleUser(loginUser);
      // 바로 객체 반환
      return loginUser;
    } catch (err) {
      return err;
    }
  }
}
