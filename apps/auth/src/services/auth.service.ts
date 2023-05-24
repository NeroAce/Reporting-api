import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDTO } from '../models/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'libs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  //helper
  async token(username) {
    const payload = username;
    const token = this.jwt.sign(payload);
    return { token };
  }

  async login(loginData: LoginDTO) {
    return await this.validateUser(loginData);
  }

  async validateUser(loginData: LoginDTO) {
    console.log(loginData);
    const user = await this.prisma.users.findFirst({
      where: {
        email: loginData.email,
      },
    });

    if (user) {
      return this.token({ username: user.email, role: user.role });
      // if (bcrypt.compare(loginData.password, user.password)) {
      //   return this.token(user.id);
      // } else {
      //   throw new BadRequestException('Wrong Password');
      // }
    } else {
      throw new NotFoundException('User Not Found');
    }
  }
}
