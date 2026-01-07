import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: UsersDto) {
    return await this.prisma.user.create({
      data: createUserDto,
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

  updateUser(id: number, updateUserDto: UsersDto) {
    return `This action updates a #${id} user`;
  }

  removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
