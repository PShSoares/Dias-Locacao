import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { QueryVehiclesDto } from './dto/query-vehicles.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(user.companyId, dto);
  }

  @Get()
  list(@CurrentUser() user: JwtPayload, @Query() query: QueryVehiclesDto) {
    return this.vehiclesService.list(user.companyId, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.vehiclesService.findOne(user.companyId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(user.companyId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.vehiclesService.remove(user.companyId, id);
  }
}