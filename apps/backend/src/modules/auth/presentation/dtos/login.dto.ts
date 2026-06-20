import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  email: string;

  @ApiProperty({ example: 'senhaSegura123' })
  @IsString()
  senha: string;
}
