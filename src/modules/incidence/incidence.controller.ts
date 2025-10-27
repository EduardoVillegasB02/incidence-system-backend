import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IncidenceService } from './incidence.service';
import {
  CreateIncidenceDto,
  FilterIncidenceDto,
  UpdateIncidenceDto,
} from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incidence')
export class IncidenceController {
  constructor(private readonly incidenceService: IncidenceService) {}

  @Roles('administrator', 'supervisor', 'operator', 'hunter', 'validator')
  @Post('add')
  create(@Body() dto: CreateIncidenceDto, @Req() req: any) {
    return this.incidenceService.create(dto, req.user);
  }

  @Roles('administrator', 'supervisor', 'operator', 'hunter', 'visualizer')
  @Get('all')
  findAllB(@Query() filters: FilterIncidenceDto, @Req() req: any) {
    return this.incidenceService.findAll(filters, req.user);
  }

  @Roles('administrator', 'supervisor', 'operator', 'hunter', 'visualizer')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.incidenceService.findOne(id, req.user);
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIncidenceDto,
    @Req() req: any,
  ) {
    return this.incidenceService.update(id, dto, req.user);
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidenceService.delete(id);
  }
}
