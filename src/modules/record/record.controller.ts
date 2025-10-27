import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Req,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RecordService } from './record.service';
import { CreateRecordDto, UpdateRecordDto } from './dto';
import { EvidenceService } from '../evidence/evidence.service';
import { PaginationDto } from '../../common/dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('record')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly evidenceService: EvidenceService,
  ) {}

  @Roles('administrator', 'supervisor', 'operator', 'hunter', 'validator')
  @Post('add')
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @Body() dto: CreateRecordDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    return this.recordService.create(dto, files, req.user);
  }

  @Get('all')
  findAll(@Query() pagination: PaginationDto, @Req() req: any) {
    return this.recordService.findAll(pagination, req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.recordService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 5))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRecordDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    return this.recordService.update(id, dto, files, req.user);
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.recordService.delete(id);
  }

  @Delete('delete/evidence/:id')
  deleteFile(@Param('id', ParseUUIDPipe) id: string) {
    return this.evidenceService.delete(id);
  }
}
