import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsAdminGuard } from 'src/common/guards/is-admin-guard';
import { FindUsersDto } from './dto/find-users-dto';
import { UserRequest } from 'src/common/middlewares/AuthMiddleware';
import { UpdateUserDto } from './dto/update-user-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';

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

    @Patch(':id')
    async update(@Req() req: UserRequest, @Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
        return this.usersService.update(id, req.user, data)
    }

    @Get('inactive')
    @UseGuards(IsAdminGuard)
    async findInactiveUsers() {
        return this.usersService.findInactiveUsers()
    }

    @Patch('password-change')
    async resetPassword(@Req() req: UserRequest, @Body() data: ResetPasswordDto) {
        return this.usersService.resetPassword(data.password, req.user.id)
    }
}
