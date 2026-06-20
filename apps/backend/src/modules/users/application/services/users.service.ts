import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT } from '../ports/user.repository.port';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import { UserOrmEntity } from '../../infrastructure/persistence/typeorm/entities/user.orm-entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async findAll(): Promise<UserOrmEntity[]> {
    return this.userRepository.findAll();
  }

  async findById(id: number): Promise<UserOrmEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async toggleActivate(id: number, ativo: boolean): Promise<UserOrmEntity> {
    await this.findById(id);
    return this.userRepository.update(id, { ativo });
  }
}
