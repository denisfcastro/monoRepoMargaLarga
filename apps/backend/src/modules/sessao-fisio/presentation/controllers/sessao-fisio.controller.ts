import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessaoFisioService } from '../../application/services/sessao-fisio.service';
import { CreateSessaoFisioDto } from '../dtos/create-sessao-fisio.dto';
import { UpdateSessaoFisioDto } from '../dtos/update-sessao-fisio.dto';

@ApiTags('sessoes')
@Controller('sessoes')
export class SessaoFisioController {
  constructor(private readonly sessaoService: SessaoFisioService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova sessão de fisioterapia' })
  create(@Body() createSessaoDto: CreateSessaoFisioDto) {
    return this.sessaoService.create(createSessaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as sessões' })
  findAll() {
    return this.sessaoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma sessão específica por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessaoService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma sessão específica' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessaoDto: UpdateSessaoFisioDto,
  ) {
    return this.sessaoService.update(id, updateSessaoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma sessão de fisioterapia' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessaoService.remove(id);
  }
}
