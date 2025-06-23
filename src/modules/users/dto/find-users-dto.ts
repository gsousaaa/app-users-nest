import { IsEnum, IsOptional } from "class-validator";
import { Order } from "src/utils/enums/Order";
import { RoleEnum } from "src/utils/enums/RoleEnum";
import { SortBy } from "src/utils/enums/SortBy";

export class FindUsersDto {
    @IsOptional()
    @IsEnum(RoleEnum, { message: `Filtro inválido. Utilize "admin" ou "user"` })
    role?: RoleEnum

    @IsOptional()
    @IsEnum(SortBy, { message: `Filtro inválido. Filtre por "name" ou "createdAt"` })
    sortBy?: SortBy

    @IsOptional()
    @IsEnum(Order, { message: `Filtro inválido. Utilize "asc" ou "desc"` })
    order?: Order
}