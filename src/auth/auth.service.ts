import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersDto } from '../users/dto/user.dto';
import { ValidateUsersDto } from 'src/users/dto/validate-user.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validateGoogleUser(loginUser: ValidateUsersDto): Promise<UsersDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginUser.email },
      });
      if (user) {
        return user;
      } else {
        const newUser: ValidateUsersDto = {
          email: loginUser.email,
          googleId: loginUser.googleId,
          picture: loginUser.picture,
        };

        return this.usersService.createUser(newUser);
      }
    } catch (error) {
      throw new Error('Error validating Google user', { cause: error });
    }
  }

  async login(user: UsersDto) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Access Token 생성 (1시간 만료)
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Refresh Token 생성 및 DB 저장 (7일 만료)
    const refresh_token = await this.generateRefreshToken(user.id);

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  /**
   * Refresh Token 생성 및 DB 저장
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    // 랜덤 토큰 생성
    const token = randomBytes(64).toString('hex');

    // 만료 시간 설정 (7일 후)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // DB에 저장
    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  /**
   * Refresh Token으로 Access Token 재발급
   */
  async refreshAccessToken(refreshToken: string) {
    // DB에서 Refresh Token 조회
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 만료 확인
    if (tokenRecord.expiresAt < new Date()) {
      // 만료된 토큰은 DB에서 삭제
      await this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    // 새 Access Token 발급
    const payload = {
      sub: tokenRecord.user.id,
      email: tokenRecord.user.email,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // 기존 Refresh Token 갱신
    const newRefreshToken = await this.generateRefreshToken(tokenRecord.user.id);

    // 기존 Refresh Token 삭제
    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });

    return {
      access_token,
      refresh_token: newRefreshToken,
      user: tokenRecord.user,
    };
  }

  /**
   * Refresh Token 무효화 (로그아웃)
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  /**
   * 특정 사용자의 모든 Refresh Token 무효화
   */
  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
