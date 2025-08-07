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
import { CrimeService } from './crime.service';
import { CreateCrimeDto, UpdateCrimeDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crime')
export class CrimeController {
  constructor(private readonly crimeService: CrimeService) {}

  @Roles('administrator')
  @Post('add')
  create(@Body() dto: CreateCrimeDto) {
    return this.crimeService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.crimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crimeService.findOne(id);
  }

  @Roles('administrator')
  @Patch('update/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCrimeDto) {
    return this.crimeService.update(id, dto);
  }

  @Roles('administrator')
  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.crimeService.delete(id);
  }
}
