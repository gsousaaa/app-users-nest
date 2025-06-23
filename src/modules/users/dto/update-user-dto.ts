import { IsEmail, IsEnum, IsOptional } from "class-validator";
import { RoleEnum } from "src/utils/enums/RoleEnum";
import { SortBy } from "src/utils/enums/SortBy";

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