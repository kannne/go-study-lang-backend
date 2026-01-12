import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateUsersDto } from '../users/dto/validate-user.dto';
import { CreateUsersDto } from '../users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(newUser: ValidateUsersDto) {
    const createUserData: CreateUsersDto = {
      email: newUser.email,
      nickname: newUser.email.split('@')[0],
      googleId: newUser.googleId,
      picture: newUser.picture,
    };

    return await this.prisma.user.create({
      data: createUserData,
    });
  }

  findAllUsers() {
    return `This action returns all users`;
  }

  async findByUserId(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  // updateUser(id: string, updateUserDto: UsersDto) {
  //   return `This action updates a #${id} user`;
  // }

  // removeUser(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
