import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from '../users/users.module';
import { USER_REPOSITORY_PORT } from '../users/application/ports/user.repository.port';
import { UserTypeOrmRepository } from '../users/infrastructure/persistence/typeorm/repositories/user.typeorm-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../users/infrastructure/persistence/typeorm/entities/user.orm-entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('JWT_EXPIRES_IN', '60m');
        return {
          secret: config.get<string>('JWT_SECRET', 'default-secret'),
          signOptions: { expiresIn: expiresIn as `${number}m` | `${number}h` | `${number}d` | number },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
