import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CavaloRepositoryPort } from '../../../../application/ports/cavalo.repository.port';
import { CavaloOrmEntity } from '../entities/cavalo.orm-entity';
import { CreateCavaloDto } from '../../../../presentation/dtos/create-cavalo.dto';
import { UpdateCavaloDto } from '../../../../presentation/dtos/update-cavalo.dto';

@Injectable()
export class CavaloTypeOrmRepository implements CavaloRepositoryPort {
  constructor(
    @InjectRepository(CavaloOrmEntity)
    private readonly ormRepository: Repository<CavaloOrmEntity>,
  ) {}

  async save(data: CreateCavaloDto): Promise<CavaloOrmEntity> {
    const entity = this.ormRepository.create(data);
    return await this.ormRepository.save(entity);
  }

  async findAll(): Promise<CavaloOrmEntity[]> {
    return await this.ormRepository.find();
  }

  async findById(
    id: number,
    relations?: string[],
  ): Promise<CavaloOrmEntity | null> {
    return await this.ormRepository.findOne({
      where: { id },
      relations: relations || [],
    });
  }

  async findByNomeAndHaras(nome: string, nomeHaras: string): Promise<CavaloOrmEntity | null> {
    return await this.ormRepository.findOne({ where: { nome, nomeHaras } });
  }

  async update(id: number, data: UpdateCavaloDto): Promise<CavaloOrmEntity> {
    await this.ormRepository.update(id, data);
    return (await this.findById(id)) as CavaloOrmEntity;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
