import { Controller, Get, Query } from '@nestjs/common';
import { IncidenceService } from '../incidence/incidence.service';
import { FilterIncidenceDto } from '../incidence/dto';

@Controller('map')
export class MapController {
  constructor(private readonly incidenceService: IncidenceService) {}

  @Get()
  findAll(@Query() dto: FilterIncidenceDto) {
    return this.incidenceService.mapIncidences(dto);
  }
}
