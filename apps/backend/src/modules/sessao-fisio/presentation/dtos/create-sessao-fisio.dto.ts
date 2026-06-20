import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessaoFisioDto {
  @ApiProperty({
    example: 'Ligamento anterolateral',
    description: 'Área ou tipo de lesão focada na sessão',
  })
  @IsNotEmpty({ message: 'O focoLesao é obrigatório.' })
  @IsString()
  focoLesao: string;

  @ApiProperty({ example: '2023-08-15', description: 'Data da sessão' })
  @IsNotEmpty({ message: 'A dataSessao é obrigatória.' })
  @IsDateString({}, { message: 'Formato de data inválido para dataSessao.' })
  dataSessao: string;

  @ApiProperty({ example: true, description: 'Se houve progresso positivo' })
  @IsNotEmpty({ message: 'A indicação de progressoBoa é obrigatória.' })
  @IsBoolean({ message: 'progressoBoa deve ser um booleano.' })
  progressoBoa: boolean;

  @ApiProperty({ example: 45, description: 'Duração em minutos' })
  @IsNotEmpty({ message: 'A duracaoMin é obrigatória.' })
  @IsNumber({}, { message: 'duracaoMin deve ser numérico.' })
  duracaoMin: number;

  @ApiProperty({ example: 1, description: 'ID do cavalo' })
  @IsNotEmpty({ message: 'O cavaloId é obrigatório.' })
  @IsNumber({}, { message: 'cavaloId deve ser numérico.' })
  cavaloId: number;
}
