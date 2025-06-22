import { Controller, Delete, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsAdminGuard } from 'src/common/guards/is-admin-guard';
import { FindUsersDto } from './dto/find-users-dto';
import { Request } from 'express';
import { UserRequest } from 'src/common/middlewares/AuthMiddleware';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(IsAdminGuard)
    async findAll(@Query() filters: FindUsersDto) {
        return this.usersService.findAll(filters)
    }

    @UseGuards(IsAdminGuard)
    @Delete(':id')
    async delete(@Req() req: UserRequest, @Param('id', ParseIntPipe) id: number) {
        return this.usersService.delete(id, req.user.id)
    }
}
