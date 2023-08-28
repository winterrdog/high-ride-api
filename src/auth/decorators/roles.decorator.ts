import { SetMetadata } from "@nestjs/common";

export function Roles(...roles: string[]) {
    return SetMetadata("roles", roles);
}
