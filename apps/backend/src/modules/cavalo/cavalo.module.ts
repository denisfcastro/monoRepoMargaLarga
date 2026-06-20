import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CavaloController } from './presentation/controllers/cavalo.controller';
import { CavaloService } from './application/services/cavalo.service';
import { CAVALO_REPOSITORY_PORT } from './application/ports/cavalo.repository.port';
import { CavaloTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/cavalo.typeorm-repository';
import { CavaloOrmEntity } from './infrastructure/persistence/typeorm/entities/cavalo.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CavaloOrmEntity])],
  controllers: [CavaloController],
  providers: [
    CavaloService,
    {
      provide: CAVALO_REPOSITORY_PORT,
      useClass: CavaloTypeOrmRepository,
    },
  ],
  exports: [CavaloService], // Exported for use in SessaoFisioModule
})
export class CavaloModule {}
