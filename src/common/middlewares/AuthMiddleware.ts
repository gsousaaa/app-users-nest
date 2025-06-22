import { NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../enums/RoleEnum";

export interface UserRequest extends Request {
    user: { id: number, name: string, email: string, role: RoleEnum }
}

export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    async use(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const header = req.headers.authorization

            const tokenType = header?.split(' ')[0]

            if (!tokenType || tokenType !== 'Bearer') throw new UnauthorizedException(`Token inválido`)

            const token = header.split(' ')[1]

            if (!token) throw new UnauthorizedException(`Token não fornecido`)

            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET_KEY })

            req.user = payload

            next()
        } catch (err) {
            throw new UnauthorizedException(`Token inválido`)
        }
    }
}