import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    UseGuards,
    Req,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Request } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateDriverStatusDto } from "./dto/users.dto";
import { AuthService } from "../auth/auth.service";
import { IJwtPayload } from "../auth/auth.interface";

@Controller("user")
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}

    @Post("register")
    async registerUser(@Body() body: CreateUserDto) {
        const user = await this.userService.createUser(body);

        if (user instanceof Error) throw user;

        const { token } = await this.authService.issueToken(user);

        return { user, token };
    }

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async viewProfile(@Req() req: Request) {
        const user = await this.userService.queryUserFromRequest(req);

        if (user instanceof Error) throw user;

        return user;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("driver") // for drivers only
    @Patch("profile/driver")
    async updateDriverStatus(
        @Body() body: UpdateDriverStatusDto,
        @Req() req: Request,
    ) {
        const { sub: userId } = req.user as IJwtPayload;

        const user = await this.userService.updateDriverStatus(userId, body);
        if (user instanceof Error) {
            throw user;
        }

        return user;
    }
}
