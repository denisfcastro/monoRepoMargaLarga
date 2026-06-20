import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CAVALO_REPOSITORY_PORT } from '../ports/cavalo.repository.port';
import type { CavaloRepositoryPort } from '../ports/cavalo.repository.port';
import { CreateCavaloDto } from '../../presentation/dtos/create-cavalo.dto';
import { UpdateCavaloDto } from '../../presentation/dtos/update-cavalo.dto';
import { CavaloOrmEntity } from '../../infrastructure/persistence/typeorm/entities/cavalo.orm-entity';

@Injectable()
export class CavaloService {
  constructor(
    @Inject(CAVALO_REPOSITORY_PORT)
    private readonly cavaloRepository: CavaloRepositoryPort,
  ) { }

  private validateCavaloRules(data: Partial<CreateCavaloDto>): void {
    if (data.dataAquisicao) {
      const dataAquisicao = new Date(data.dataAquisicao);
      const hoje = new Date();
      if (dataAquisicao > hoje) {
        throw new BadRequestException(
          'A dataAquisicao não pode ser uma data futura.',
        );
      }
    }

    if (data.valorCompra !== undefined) {
      if (data.valorCompra <= 0) {
        throw new BadRequestException('O valorCompra deve ser maior que 0.');
      }
    }
  }

  async create(data: CreateCavaloDto): Promise<CavaloOrmEntity> {
    this.validateCavaloRules(data);

    const exists = await this.cavaloRepository.findByNomeAndHaras(data.nome, data.nomeHaras);
    if (exists) {
      throw new ConflictException(`Um cavalo com o nome '${data.nome}' já existe no haras '${data.nomeHaras}'.`);
    }

    return await this.cavaloRepository.save(data);
  }

  async findAll(): Promise<CavaloOrmEntity[]> {
    return await this.cavaloRepository.findAll();
  }

  async findById(id: number, relations?: string[]): Promise<CavaloOrmEntity> {
    const cavalo = await this.cavaloRepository.findById(id, relations);
    if (!cavalo) {
      throw new NotFoundException(`Cavalo com ID ${id} não encontrado.`);
    }
    return cavalo;
  }

  async update(id: number, data: UpdateCavaloDto): Promise<CavaloOrmEntity> {
    await this.findById(id); // Check existence
    this.validateCavaloRules(data);
    return await this.cavaloRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    const cavalo = await this.findById(id);
    await this.cavaloRepository.delete(cavalo.id);
  }
}
