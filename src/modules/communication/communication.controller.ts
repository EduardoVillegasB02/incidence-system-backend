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
import { CommunicationService } from './communication.service';
import { CreateCommunicationDto, UpdateCommunicationDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Roles('administrator')
  @Post('add')
  create(@Body() dto: CreateCommunicationDto) {
    return this.communicationService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.communicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.communicationService.findOne(id);
  }

  @Roles('administrator')
  @Patch('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommunicationDto,
  ) {
    return this.communicationService.update(id, dto);
  }

  @Roles('administrator')
  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.communicationService.delete(id);
  }
}
