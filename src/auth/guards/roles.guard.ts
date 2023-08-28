import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UsersService } from "../../users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>(
            "roles",
            context.getHandler(),
        );

        // deny access to requests without roles
        if (!requiredRoles) return false;

        // allow public access
        if (requiredRoles.length === 0) return true;

        // get user from request object
        const req = context.switchToHttp().getRequest();
        const user = await this.userService.queryUserFromRequest(req);
        if (user instanceof Error) {
            throw user;
        }

        // Checks whether a user belongs to a passed in role
        const matchRoles = function (roles: string[]) {
            return roles.some(function (element) {
                return element === user.role;
            });
        };

        return matchRoles(requiredRoles);
    }
}
