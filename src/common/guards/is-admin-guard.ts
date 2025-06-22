import { CanActivate, ExecutionContext } from "@nestjs/common";

export class IsAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest()

        return req.user?.role === 'admin'
    }
}