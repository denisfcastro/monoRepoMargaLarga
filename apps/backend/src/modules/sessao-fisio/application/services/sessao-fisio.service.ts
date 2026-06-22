import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SESSAO_FISIO_REPOSITORY_PORT } from '../ports/sessao-fisio.repository.port';
import type { SessaoFisioRepositoryPort } from '../ports/sessao-fisio.repository.port';
import { CreateSessaoFisioDto } from '../../presentation/dtos/create-sessao-fisio.dto';
import { UpdateSessaoFisioDto } from '../../presentation/dtos/update-sessao-fisio.dto';
import { SessaoFisioOrmEntity } from '../../infrastructure/persistence/typeorm/entities/sessao-fisio.orm-entity';
import { CavaloService } from '../../../cavalo/application/services/cavalo.service';

@Injectable()
export class SessaoFisioService {
  constructor(
    @Inject(SESSAO_FISIO_REPOSITORY_PORT)
    private readonly sessaoRepository: SessaoFisioRepositoryPort,
    private readonly cavaloService: CavaloService,
  ) { }

  private async validateSessaoRules(
    data: Partial<CreateSessaoFisioDto>,
    _isUpdate = false,
    sessaoId?: number,
  ): Promise<void> {
    // 2. Consistência Temporal: dataSessao não pode ser posterior a atual
    if (data.dataSessao) {
      const sessaoDate = new Date(data.dataSessao);
      const hoje = new Date();
      if (sessaoDate > hoje) {
        throw new BadRequestException(
          'A data da Sessão não pode ser posterior à data atual.',
        );
      }
    }

    // 4. Regra de Negócio: duracaoMin entre 30 e 90 minutos
    if (data.duracaoMin !== undefined) {
      if (data.duracaoMin < 30 || data.duracaoMin > 90) {
        throw new BadRequestException(
          'A duracaoMin deve estar entre 30 e 90 minutos.',
        );
      }
    }

    // 7. Regex de palavras proibidas no focoLesao
    if (data.focoLesao) {
      const regexWords = /crítica|terminal|irreversível/i;
      if (regexWords.test(data.focoLesao)) {
        throw new BadRequestException(
          'O focoLesao contém palavras alarmantes bloqueadas pela regra de negócio.',
        );
      }
    }

    // Validações que exigem checagem de outras entidades apenas se os campos estiverem mudando/criando
    if (data.cavaloId !== undefined) {
      // 3. Integridade e Tratamento do Cavalo
      const cavalo = await this.cavaloService
        .findById(data.cavaloId)
        .catch(() => {
          throw new NotFoundException(
            `Cavalo com ID ${data.cavaloId} não existe.`,
          );
        });
      if (!cavalo.emTratamento) {
        throw new ForbiddenException(
          'Não é possível adicionar ou alterar a sessão. O cavalo já recebeu alta (não está em tratamento).',
        );
      }
    }

    // 6. Regra Histórica Condicional do progressoBoa
    if (data.progressoBoa === true && data.cavaloId && data.focoLesao) {
      // Busca a última sessão anterior a esta pra checar a progressão
      const previousSession =
        await this.sessaoRepository.findLastSessaoByCavaloAndFoco(
          data.cavaloId,
          data.focoLesao,
          data.dataSessao, // Usa a data da sessão para achar as antigas a essa (caso atualizando algo retroativo)
        );

      if (previousSession) {
        // Se a sessão anterior (do mesmo id omitido se for a mesma) NÃO for progressoBoa
        if (!previousSession.progressoBoa && previousSession.id !== sessaoId) {
          throw new BadRequestException(
            `Inconsistência de progresso: a sessão anterior para '${data.focoLesao}' não declarou progresso positivo. Certifique-se da progressão ser consistente ou adicione o registro de transição corretamente.`,
          );
        }
      }
    }
  }

  async create(
    createSessaoDto: CreateSessaoFisioDto,
  ): Promise<SessaoFisioOrmEntity> {
    await this.validateSessaoRules(createSessaoDto);

    const exists = await this.sessaoRepository.findByCavaloAndData(createSessaoDto.cavaloId, createSessaoDto.dataSessao);
    if (exists) {
      throw new ConflictException(`Já existe uma sessão para o cavalo ID ${createSessaoDto.cavaloId} na data ${createSessaoDto.dataSessao}.`);
    }

    return await this.sessaoRepository.save(createSessaoDto);
  }

  async findAll(): Promise<SessaoFisioOrmEntity[]> {
    return await this.sessaoRepository.findAll();
  }

  async findById(id: number): Promise<SessaoFisioOrmEntity> {
    const sessao = await this.sessaoRepository.findById(id);
    if (!sessao) {
      throw new NotFoundException(`SessãoFisio com ID ${id} não localizada.`);
    }
    return sessao;
  }

  async update(
    id: number,
    updateSessaoDto: UpdateSessaoFisioDto,
  ): Promise<SessaoFisioOrmEntity> {
    const existingSession = await this.findById(id);

    // Mesclagem simples simulada apenas para revalidar regras dependentes:
    const dataToTest = {
      ...existingSession,
      ...updateSessaoDto,
    };

    await this.validateSessaoRules(dataToTest, true, id);
    return await this.sessaoRepository.update(id, updateSessaoDto);
  }

  async remove(id: number): Promise<void> {
    const sessao = await this.findById(id);
    await this.sessaoRepository.delete(sessao.id);
  }
}
