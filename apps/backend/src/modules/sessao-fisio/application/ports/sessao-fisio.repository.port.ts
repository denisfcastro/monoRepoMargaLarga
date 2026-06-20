import { SessaoFisioOrmEntity } from '../../infrastructure/persistence/typeorm/entities/sessao-fisio.orm-entity';
import { CreateSessaoFisioDto } from '../../presentation/dtos/create-sessao-fisio.dto';
import { UpdateSessaoFisioDto } from '../../presentation/dtos/update-sessao-fisio.dto';

export const SESSAO_FISIO_REPOSITORY_PORT = Symbol(
  'SESSAO_FISIO_REPOSITORY_PORT',
);

export interface SessaoFisioRepositoryPort {
  save(data: CreateSessaoFisioDto): Promise<SessaoFisioOrmEntity>;
  findAll(): Promise<SessaoFisioOrmEntity[]>;
  findById(id: number): Promise<SessaoFisioOrmEntity | null>;
  update(id: number, data: UpdateSessaoFisioDto): Promise<SessaoFisioOrmEntity>;
  delete(id: number): Promise<void>;

  // Custom queries
  findLastSessaoByCavaloAndFoco(
    cavaloId: number,
    focoLesao: string,
    beforeDate?: string,
  ): Promise<SessaoFisioOrmEntity | null>;
  findByCavaloAndData(
    cavaloId: number,
    dataSessao: string,
  ): Promise<SessaoFisioOrmEntity | null>;
}
