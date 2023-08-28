import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RidesService } from "./rides.service";
import { CreateRideDto, UpdateRideStatusDto } from "./dto/rides.dto";
import { Request } from "express";
import {
    IsBodyEmptyPipe,
    IsHexadecimalStringPipe,
    IsRideStatusOkPipe,
} from "../validation.pipes";

@Controller("rides")
@UseGuards(JwtAuthGuard) // allow authenticated users only
export class RidesController {
    constructor(private rideService: RidesService) {}

    @UseGuards(RolesGuard)
    @Roles("driver") // only drivers get rides
    @Get()
    async fetchAllRides(@Req() req: Request) {
        const rides = await this.rideService.queryAllRides(req);

        if (rides instanceof Error) throw rides;

        return rides;
    }

    @UseGuards(RolesGuard)
    @Roles("passenger") // only passengers create rides
    @Post()
    async createRide(
        @Body(new IsBodyEmptyPipe()) reqBody: CreateRideDto,
        @Req() req: Request,
    ) {
        const ride = await this.rideService.createRide(req, reqBody);

        if (ride instanceof Error) throw ride;

        return ride;
    }

    @Patch(":id")
    async updateRideStatus(
        @Param("id", new IsHexadecimalStringPipe()) id: string,
        @Body(new IsBodyEmptyPipe(), new IsRideStatusOkPipe())
        reqBody: UpdateRideStatusDto,
        @Req() req: Request,
    ) {
        const ride = await this.rideService.updateRideStatus(id, req, reqBody);

        if (ride instanceof Error) throw ride;

        return ride;
    }
}
