import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * DB 연결 상태 확인
   * - User, Reading 테이블 레코드 수 조회
   */
  async checkDatabase() {
    try {
      const userCount = await this.prisma.user.count();
      const readingCount = await this.prisma.reading.count();

      return {
        connected: true,
        tables: {
          users: userCount,
          readings: readingCount,
        },
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
