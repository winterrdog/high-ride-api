import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { UserDocument } from "../users/schemas/users.schema";
import { IJwtPayload, ILoginResult } from "./auth.interface";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        try {
            const user = await this.userService.queryUserByEmail(email);
            if (!user) {
                return null;
            }

            if (user instanceof Error) {
                throw user;
            }

            const isPasswdValid =
                await user.schema.methods.compareDbPassword(password);
            if (!isPasswdValid) {
                return null;
            }

            return user;
        } catch (err) {
            throw err;
        }
    }

    async issueToken(user: UserDocument): Promise<ILoginResult> {
        const payload: IJwtPayload = {
            sub: user._id.toString(),
            role: user.role,
        };

        return {
            token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
            }),
        };
    }
}
