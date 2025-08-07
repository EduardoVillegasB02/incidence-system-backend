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
import { JurisdictionService } from './jurisdiction.service';
import { CreateJurisdictionDto, UpdateJurisdictionDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jurisdiction')
export class JurisdictionController {
  constructor(private readonly jurisdictionService: JurisdictionService) {}

  @Roles('administrator')
  @Post('add')
  create(@Body() dto: CreateJurisdictionDto) {
    return this.jurisdictionService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.jurisdictionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jurisdictionService.findOne(id);
  }

  @Roles('administrator')
  @Patch('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJurisdictionDto,
  ) {
    return this.jurisdictionService.update(id, dto);
  }

  @Roles('administrator')
  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.jurisdictionService.delete(id);
  }
}
