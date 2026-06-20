import { UserOrmEntity } from '../../infrastructure/persistence/typeorm/entities/user.orm-entity';

export const USER_REPOSITORY_PORT = 'USER_REPOSITORY_PORT';

export interface UserRepositoryPort {
  findAll(): Promise<UserOrmEntity[]>;
  findById(id: number): Promise<UserOrmEntity | null>;
  findByEmail(email: string): Promise<UserOrmEntity | null>;
  save(data: Partial<UserOrmEntity>): Promise<UserOrmEntity>;
  update(id: number, data: Partial<UserOrmEntity>): Promise<UserOrmEntity>;
}
