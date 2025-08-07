import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Roles('administrator', 'supervisor')
  @Post('add')
  create(@Body() dto: CreateAssignmentDto, @Req() req: any) {
    return this.assignmentService.create(dto, req.user);
  }

  @Roles('administrator', 'supervisor')
  @Get('all/:id')
  findAllByIncidence(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentService.findAllByIncidence(id);
  }

  @Roles('administrator', 'supervisor')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentService.findOne(id);
  }

  @Roles('administrator', 'supervisor')
  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentService.delete(id);
  }
}
