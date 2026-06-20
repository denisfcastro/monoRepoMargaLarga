import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT } from '../../application/ports/user.repository.port';
import type { UserRepositoryPort } from '../../application/ports/user.repository.port';


@Injectable()
export class AdminSeederService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'admin@mangalarga.com');
    const existing = await this.userRepository.findByEmail(adminEmail);

    if (!existing) {
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD', 'Admin@1234');
      const adminNome = this.configService.get<string>('ADMIN_NOME', 'Administrador');
      const hashed = await bcrypt.hash(adminPassword, 10);

      await this.userRepository.save({
        nome: adminNome,
        email: adminEmail,
        senha: hashed,
        ativo: true,
        role: 'admin',
      });

      this.logger.log(`Usuário administrador criado: ${adminEmail}`);
    }
  }
}
