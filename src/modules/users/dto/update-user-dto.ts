import { IsEmail, IsEnum, IsOptional } from "class-validator";
import { RoleEnum } from "src/common/enums/RoleEnum";
import { SortBy } from "src/common/enums/SortBy";

export class UpdateUserDto {
    @IsOptional()
    name?: string

    @IsOptional()
    @IsEmail()
    email?: SortBy

    @IsOptional()
    @IsEnum(RoleEnum)
    role?: RoleEnum
}