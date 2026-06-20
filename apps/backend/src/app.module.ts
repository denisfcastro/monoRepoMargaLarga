import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CavaloModule } from './modules/cavalo/cavalo.module';
import { SessaoFisioModule } from './modules/sessao-fisio/sessao-fisio.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/clinicaEquina.db',
      autoLoadEntities: true,
      synchronize: true, // apenas para este ambiente de laboratório
    }),
    CavaloModule,
    SessaoFisioModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
