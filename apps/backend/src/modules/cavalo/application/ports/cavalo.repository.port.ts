import { CavaloOrmEntity } from '../../infrastructure/persistence/typeorm/entities/cavalo.orm-entity';
import { CreateCavaloDto } from '../../presentation/dtos/create-cavalo.dto';
import { UpdateCavaloDto } from '../../presentation/dtos/update-cavalo.dto';

export const CAVALO_REPOSITORY_PORT = Symbol('CAVALO_REPOSITORY_PORT');

export interface CavaloRepositoryPort {
  save(data: CreateCavaloDto): Promise<CavaloOrmEntity>;
  findAll(): Promise<CavaloOrmEntity[]>;
  findById(id: number, relations?: string[]): Promise<CavaloOrmEntity | null>;
  findByNomeAndHaras(nome: string, nomeHaras: string): Promise<CavaloOrmEntity | null>;
  update(id: number, data: UpdateCavaloDto): Promise<CavaloOrmEntity>;
  delete(id: number): Promise<void>;
}
