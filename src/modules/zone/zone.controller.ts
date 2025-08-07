import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto, UpdateZoneDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Roles('administrator')
  @Post('add')
  create(@Body() dto: CreateZoneDto) {
    return this.zoneService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.zoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.findOne(id);
  }

  @Roles('administrator')
  @Patch('update/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateZoneDto) {
    return this.zoneService.update(id, dto);
  }

  @Roles('administrator')
  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.delete(id);
  }
}
