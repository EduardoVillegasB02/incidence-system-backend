import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../user/dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../auth/guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('supervisor')
export class SupervisorController {
  constructor(private readonly userService: UserService) {}

  @Roles('administrator')
  @Post('add')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto, 'supervisor');
  }

  @Roles('administrator', 'supervisor')
  @Get('all')
  findAll(@Query() dto: FilterUserDto) {
    return this.userService.findAll(dto, 'supervisor');
  }

  @Roles('administrator')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Roles('administrator')
  @Patch('update/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Roles('administrator')
  @Delete('delete/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
