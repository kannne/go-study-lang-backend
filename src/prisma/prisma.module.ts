import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Prisma Global Module
 * - @Global: 모든 모듈에서 PrismaService 사용 가능 (imports 불필요)
 * - exports: 다른 모듈에 PrismaService 제공
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
