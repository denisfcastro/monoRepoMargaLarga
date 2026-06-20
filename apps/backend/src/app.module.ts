import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CavaloModule } from './modules/cavalo/cavalo.module';
import { SessaoFisioModule } from './modules/sessao-fisio/sessao-fisio.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/clinicaEquina.db',
      autoLoadEntities: true,
      synchronize: true, // apenas para este ambiente de laboratório
    }),
    CavaloModule,
    SessaoFisioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
