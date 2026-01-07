import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersDto } from '../users/dto/user.dto';
import { ValidateUsersDto } from 'src/users/dto/validate-user.dto';
import { randomUUID } from 'crypto';

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
        // TODO: picture TS 에러 및 처리
        return user;
      } else {
        const newUser: UsersDto = {
          id: randomUUID(),
          email: loginUser.email,
          nickname: loginUser.email.split('@')[0],
          googleId: loginUser.googleId,
          picture: loginUser.picture,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return this.usersService.createUser(newUser);
      }
    } catch (error) {
      throw new Error('Error validating Google user', { cause: error });
    }
  }

  login(user: UsersDto) {
    const payload = {
      sub: user.id,
      email: user.email
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
