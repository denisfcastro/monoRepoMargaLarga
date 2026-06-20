import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessaoFisioController } from './presentation/controllers/sessao-fisio.controller';
import { SessaoFisioService } from './application/services/sessao-fisio.service';
import { SESSAO_FISIO_REPOSITORY_PORT } from './application/ports/sessao-fisio.repository.port';
import { SessaoFisioTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/sessao-fisio.typeorm-repository';
import { SessaoFisioOrmEntity } from './infrastructure/persistence/typeorm/entities/sessao-fisio.orm-entity';
import { CavaloModule } from '../cavalo/cavalo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessaoFisioOrmEntity]),
    CavaloModule, // Necessário para usar CavaloService e validar Integridade
  ],
  controllers: [SessaoFisioController],
  providers: [
    SessaoFisioService,
    {
      provide: SESSAO_FISIO_REPOSITORY_PORT,
      useClass: SessaoFisioTypeOrmRepository,
    },
  ],
})
export class SessaoFisioModule {}
