import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from 'express';
import { PrismaService } from "../../prisma/prisma.service";

/**
 * JWT 토큰을 쿠키 또는 Authorization 헤더에서 추출
 */
const cookieExtractor = (req: Request): string | null => {
  let token = null as string | null;
  if (req && req.cookies) {
    token = req.cookies['access_token'] as string;
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      // 쿠키 또는 Bearer 헤더에서 토큰 추출 (둘 다 지원)
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret-key-for-development',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}