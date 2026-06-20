import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessaoFisioRepositoryPort } from '../../../../application/ports/sessao-fisio.repository.port';
import { SessaoFisioOrmEntity } from '../entities/sessao-fisio.orm-entity';
import { CreateSessaoFisioDto } from '../../../../presentation/dtos/create-sessao-fisio.dto';
import { UpdateSessaoFisioDto } from '../../../../presentation/dtos/update-sessao-fisio.dto';

@Injectable()
export class SessaoFisioTypeOrmRepository implements SessaoFisioRepositoryPort {
  constructor(
    @InjectRepository(SessaoFisioOrmEntity)
    private readonly ormRepository: Repository<SessaoFisioOrmEntity>,
  ) {}

  async save(data: CreateSessaoFisioDto): Promise<SessaoFisioOrmEntity> {
    const entity = this.ormRepository.create(data);
    return await this.ormRepository.save(entity);
  }

  async findAll(): Promise<SessaoFisioOrmEntity[]> {
    return await this.ormRepository.find();
  }

  async findById(id: number): Promise<SessaoFisioOrmEntity | null> {
    return await this.ormRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    data: UpdateSessaoFisioDto,
  ): Promise<SessaoFisioOrmEntity> {
    await this.ormRepository.update(id, data);
    return (await this.findById(id)) as SessaoFisioOrmEntity;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async findLastSessaoByCavaloAndFoco(
    cavaloId: number,
    focoLesao: string,
    beforeDate?: string,
  ): Promise<SessaoFisioOrmEntity | null> {
    const query = this.ormRepository
      .createQueryBuilder('s')
      .where('s.cavaloId = :cavaloId', { cavaloId })
      .andWhere('s.focoLesao = :focoLesao', { focoLesao });

    if (beforeDate) {
      query.andWhere('s.dataSessao < :beforeDate', { beforeDate });
    }

    query.orderBy('s.dataSessao', 'DESC');

    return await query.getOne();
  }

  async findByCavaloAndData(cavaloId: number, dataSessao: string): Promise<SessaoFisioOrmEntity | null> {
    return await this.ormRepository.findOne({
      where: { cavaloId, dataSessao },
    });
  }
}
