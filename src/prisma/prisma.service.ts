import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Database Service
 * - DB 연결 관리 (Spring의 DataSource 역할)
 * - 앱 시작 시 자동 연결, 종료 시 자동 해제
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('✅ PostgreSQL connected via Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 PostgreSQL disconnected');
  }
}
