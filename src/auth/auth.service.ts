import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersDto } from '../users/dto/user.dto';
import { ValidateUsersDto } from 'src/users/dto/validate-user.dto';

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

  login(user: UsersDto) {
    const payload = {
      sub: user.id,
      email: user.email
    };

    return {
      // jwt 토큰 생성
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
