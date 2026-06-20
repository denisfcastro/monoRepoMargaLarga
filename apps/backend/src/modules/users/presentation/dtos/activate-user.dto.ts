import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateUserDto {
  @ApiProperty({ description: 'Define se o usuário deve ser ativado (true) ou desativado (false)' })
  @IsBoolean()
  ativo: boolean;
}
