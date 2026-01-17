import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 인증 Guard
 *
 * @UseGuards(JwtAuthGuard)를 사용하여 컨트롤러 메서드를 보호
 * JwtStrategy의 validate 메서드를 실행하여 JWT 토큰 검증
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
