import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { UserDocument } from "../../users/schemas/users.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: "email",
        });
    }

    async validate(email: string, password: string) {
        const user: UserDocument = await this.authService.validateUser(
            email,
            password,
        );
        if (!user) {
            throw new UnauthorizedException("User is not authenticated");
        }

        return user;
    }
}
