import { Test, TestingModule } from '@nestjs/testing';
import { SessaoFisioService } from './sessao-fisio.service';
import { SESSAO_FISIO_REPOSITORY_PORT } from '../ports/sessao-fisio.repository.port';
import { CavaloService } from '../../../cavalo/application/services/cavalo.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessaoFisioDto } from '../../presentation/dtos/create-sessao-fisio.dto';

const mockSessaoRepository = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findLastSessaoByCavaloAndFoco: jest.fn(),
};

const mockCavaloService = {
  findById: jest.fn(),
};

describe('SessaoFisioService Validations', () => {
  let service: SessaoFisioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessaoFisioService,
        {
          provide: SESSAO_FISIO_REPOSITORY_PORT,
          useValue: mockSessaoRepository,
        },
        {
          provide: CavaloService,
          useValue: mockCavaloService,
        },
      ],
    }).compile();

    service = module.get<SessaoFisioService>(SessaoFisioService);
    jest.clearAllMocks();
  });

  describe('validateSessaoRules', () => {
    it('should throw BadRequestException if dataSessao is in the future', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const dto = { dataSessao: futureDate, resumo: 'Test' };

      await expect(
        service.create(dto as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(dto as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow('A dataSessao não pode ser posterior à data atual.');
    });

    it('should throw BadRequestException if duracaoMin is not between 30 and 90', async () => {
      const dtoSmall = { duracaoMin: 29, resumo: 'Test' };
      const dtoLarge = { duracaoMin: 91, resumo: 'Test' };

      await expect(
        service.create(dtoSmall as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(dtoLarge as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if focoLesao contains forbidden words', async () => {
      const dtoCritica = { focoLesao: 'Situação crítica aqui', resumo: 'Test' };
      const dtoTerminal = { focoLesao: 'terminal', resumo: 'Test' };
      const dtoIrreversivel = {
        focoLesao: 'estado IrreVerSível',
        resumo: 'Test',
      };

      await expect(
        service.create(dtoCritica as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(dtoTerminal as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(dtoIrreversivel as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if cavalo does not exist', async () => {
      mockCavaloService.findById.mockRejectedValue(new NotFoundException());
      const dto = { cavaloId: 99, resumo: 'Test' };

      await expect(
        service.create(dto as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if cavalo is not emTratamento', async () => {
      mockCavaloService.findById.mockResolvedValue({
        id: 1,
        emTratamento: false,
      });
      const dto = { cavaloId: 1, resumo: 'Test' };

      await expect(
        service.create(dto as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if progressoBoa is true but previous session is not', async () => {
      mockCavaloService.findById.mockResolvedValue({
        id: 1,
        emTratamento: true,
      });
      mockSessaoRepository.findLastSessaoByCavaloAndFoco.mockResolvedValue({
        id: 1,
        progressoBoa: false,
      });

      const dto = {
        cavaloId: 1,
        focoLesao: 'Pata',
        progressoBoa: true,
        resumo: 'Test',
      };

      await expect(
        service.create(dto as unknown as CreateSessaoFisioDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should pass basic validations', async () => {
      mockCavaloService.findById.mockResolvedValue({
        id: 1,
        emTratamento: true,
      });
      mockSessaoRepository.findLastSessaoByCavaloAndFoco.mockResolvedValue({
        id: 1,
        progressoBoa: true,
      });
      mockSessaoRepository.save.mockResolvedValue({ id: 2 });

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const dto = {
        cavaloId: 1,
        focoLesao: 'Pata Traseira',
        progressoBoa: true,
        duracaoMin: 60,
        dataSessao: pastDate,
        resumo: 'Test',
      };

      const result = await service.create(
        dto as unknown as CreateSessaoFisioDto,
      );
      expect(result).toBeDefined();
    });
  });
});
