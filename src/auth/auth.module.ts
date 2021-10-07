import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.stategy';

@Module({
  imports: [
    UsersModule, 
    PassportModule.register({      
      defaultStrategy: 'jwt',      
      property: 'user',      
      session: false,    
  }),
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRETKEY, 
      signOptions: {
          expiresIn: process.env.EXPIRESIN,
      },
  }),

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
