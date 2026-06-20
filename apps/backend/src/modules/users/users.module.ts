import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/user.typeorm-repository';
import { USER_REPOSITORY_PORT } from './application/ports/user.repository.port';
import { UsersService } from './application/services/users.service';
import { UsersController } from './presentation/controllers/users.controller';
import { AdminSeederService } from './infrastructure/seeds/admin-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AdminSeederService,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
