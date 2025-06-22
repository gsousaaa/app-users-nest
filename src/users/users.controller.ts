import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsAdminGuard } from 'src/common/guards/is-admin-guard';
import { FindUsersDto } from './dto/find-users-dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(IsAdminGuard)
    async findAll(@Query() filters: FindUsersDto) {
        return this.usersService.findAll(filters)
    }

  
}
