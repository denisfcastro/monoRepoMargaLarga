import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CavaloService } from '../../application/services/cavalo.service';
import { CreateCavaloDto } from '../dtos/create-cavalo.dto';
import { UpdateCavaloDto } from '../dtos/update-cavalo.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('cavalos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('cavalos')
export class CavaloController {
  constructor(private readonly cavaloService: CavaloService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo cavalo' })
  create(@Body() createCavaloDto: CreateCavaloDto) {
    return this.cavaloService.create(createCavaloDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cavalos' })
  findAll() {
    return this.cavaloService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar um cavalo por ID com as sessões relacionadas',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cavaloService.findById(id, ['sessoes']);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar os dados de um cavalo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCavaloDto: UpdateCavaloDto,
  ) {
    return this.cavaloService.update(id, updateCavaloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um cavalo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cavaloService.remove(id);
  }
}
