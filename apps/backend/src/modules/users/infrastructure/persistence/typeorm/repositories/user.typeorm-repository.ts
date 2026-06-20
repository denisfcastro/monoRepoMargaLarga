import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import type { UserRepositoryPort } from '../../../../application/ports/user.repository.port';

@Injectable()
export class UserTypeOrmRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  findAll(): Promise<UserOrmEntity[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<UserOrmEntity | null> {
    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.repo.findOneBy({ email });
  }

  async save(data: Partial<UserOrmEntity>): Promise<UserOrmEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<UserOrmEntity>): Promise<UserOrmEntity> {
    await this.repo.update(id, data);
    return this.repo.findOneByOrFail({ id });
  }
}
