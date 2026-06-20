import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCavaloDto {
  @ApiProperty({ example: 'Pé de Pano', description: 'Nome do cavalo' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'Haras Eldorado',
    description: 'Nome do haras de origem do cavalo',
  })
  @IsNotEmpty({ message: 'O nomeHaras é obrigatório.' })
  @IsString()
  nomeHaras: string;

  @ApiProperty({
    example: '2023-05-10',
    description: 'Data de entrada do cavalo na clínica',
  })
  @IsNotEmpty({ message: 'A dataAquisicao é obrigatória.' })
  @IsDateString({}, { message: 'Formato de data inválido para dataAquisicao.' })
  dataAquisicao: string;

  @ApiProperty({
    example: true,
    description: 'Indica se o cavalo está atualmente em reabilitação ativa',
  })
  @IsNotEmpty({ message: 'O status emTratamento é obrigatório.' })
  @IsBoolean({ message: 'emTratamento deve ser um booleano.' })
  emTratamento: boolean;

  @ApiProperty({ example: 15000, description: 'Valor de aquisição do cavalo' })
  @IsNotEmpty({ message: 'O valorCompra é obrigatório.' })
  @IsNumber({}, { message: 'valorCompra deve ser um número.' })
  valorCompra: number;
}
