import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../application/services/users.service';
import { ActivateUserDto } from '../dtos/activate-user.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários (somente admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Ativar ou desativar um usuário (somente admin)' })
  activate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActivateUserDto,
  ) {
    return this.usersService.toggleActivate(id, dto.ativo);
  }
}
