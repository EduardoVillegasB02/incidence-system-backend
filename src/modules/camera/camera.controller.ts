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
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { CameraService } from './camera.service';
import { CreateCameraDto, UpdateCameraDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('camera')
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Roles('administrator')
  @Post('add')
  create(@Body() dto: CreateCameraDto) {
    return this.cameraService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.cameraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cameraService.findOne(id);
  }

  @Roles('administrator')
  @Patch('update/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCameraDto) {
    return this.cameraService.update(id, dto);
  }

  @Roles('administrator')
  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.cameraService.delete(id);
  }

  @Roles('administrator')
  @Post('add-masive')
  @UseInterceptors(FileInterceptor('file'))
  bulkUpload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return this.cameraService.bulkUpload(data, req.user);
  }
}
