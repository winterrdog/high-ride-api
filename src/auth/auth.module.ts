import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";

// load env vars
import * as dotenv from "dotenv";
dotenv.config();

@Module({
    imports: [
        UsersModule,
        PassportModule.register({
            session: false,
        }),
        JwtModule.register({
            secretOrPrivateKey: process.env.JWT_SECRET,
            signOptions: { algorithm: "HS384", expiresIn: "3d" },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
