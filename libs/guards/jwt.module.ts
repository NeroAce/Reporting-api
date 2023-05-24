import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANT } from 'libs/constants/constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANT,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [],
  controllers: [],
})
export class JWTModule {}
