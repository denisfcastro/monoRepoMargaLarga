import { Test, TestingModule } from '@nestjs/testing';
import { CavaloService } from './cavalo.service';
import { CAVALO_REPOSITORY_PORT } from '../ports/cavalo.repository.port';
import { BadRequestException } from '@nestjs/common';
import { CreateCavaloDto } from '../../presentation/dtos/create-cavalo.dto';

const mockCavaloRepository = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CavaloService Validations', () => {
  let service: CavaloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CavaloService,
        {
          provide: CAVALO_REPOSITORY_PORT,
          useValue: mockCavaloRepository,
        },
      ],
    }).compile();

    service = module.get<CavaloService>(CavaloService);
    jest.clearAllMocks();
  });

  describe('validateCavaloRules', () => {
    it('should throw BadRequestException if dataAquisicao is in the future', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const dto = {
        nomeHaras: 'Haras Pé de Pano',
        dataAquisicao: futureDate.toISOString(),
      } as unknown as CreateCavaloDto;

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'A dataAquisicao não pode ser uma data futura.',
      );
    });

    it('should throw BadRequestException if valorCompra is zero or negative', async () => {
      const dtoZero = {
        nomeHaras: 'Haras Pé de Pano',
        valorCompra: 0,
      } as unknown as CreateCavaloDto;

      const dtoNegative = {
        nomeHaras: 'Haras Pé de Pano',
        valorCompra: -100,
      } as unknown as CreateCavaloDto;

      await expect(service.create(dtoZero)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(dtoNegative)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should pass if validation rules are met', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const dto = {
        nomeHaras: 'Haras Pé de Pano',
        dataAquisicao: pastDate.toISOString(),
        valorCompra: 1000,
      } as unknown as CreateCavaloDto;

      mockCavaloRepository.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toBeDefined();
    });
  });
});
