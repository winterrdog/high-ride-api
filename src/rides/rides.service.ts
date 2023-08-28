import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ride, RideDocument } from "./schemas/rides.schema";
import { CreateRideDto, UpdateRideStatusDto } from "./dto/rides.dto";
import { Request } from "express";
import { UsersService } from "../users/users.service";

@Injectable()
export class RidesService {
    constructor(
        @InjectModel(Ride.name) private rideModel: Model<Ride>,
        private userService: UsersService,
    ) {}

    // get all rides
    async queryAllRides(req: Request) {
        try {
            // check if a driver's status is available
            const user = await this.userService.queryUserFromRequest(req);

            if (user instanceof Error) return user;

            if (user.driverStatus !== "available") {
                return new ForbiddenException(
                    "You can't get rides if you're not available.",
                );
            }

            const rides = await this.rideModel.find();
            if (!rides) {
                return new NotFoundException("No rides found.");
            }

            return rides;
        } catch (_) {
            return new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // create a new ride
    async createRide(req: Request, ride: CreateRideDto) {
        try {
            const user = await this.userService.queryUserFromRequest(req);

            if (user instanceof Error) return user;

            const newRide = new this.rideModel({
                passenger: user._id,
                pickUpLocation: ride.pickupLocation,
                dropOffLocation: ride.dropoffLocation,
            });

            return await newRide.save();
        } catch (_) {
            return new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // update a ride's status
    async updateRideStatus(
        rideId: string,
        req: Request,
        reqBody: UpdateRideStatusDto,
    ) {
        try {
            const user = await this.userService.queryUserFromRequest(req);

            if (user instanceof Error) return user;

            let ride;

            // if user's a driver and ride status is accepted,
            // update driver & ride status
            if (user.role === "driver" && reqBody.rideStatus === "accepted") {
                // check if driver's available
                if (user.driverStatus !== "available") {
                    return new ForbiddenException(
                        "You can't accept a ride if you're not available.",
                    );
                }

                // check if driver's already accepted a ride
                const driver = await this.rideModel.findOne({
                    driver: user._id,
                });
                if (driver) {
                    return new ForbiddenException(
                        "You cannot accept a new ride if you have already accepted another ride.",
                    );
                }

                ride = await this.rideModel.findByIdAndUpdate(
                    rideId,
                    { driver: user._id, rideStatus: reqBody.rideStatus },
                    { new: true },
                );
            } else if (
                user.role === "driver" &&
                reqBody.rideStatus === "canceled"
            ) {
                ride = await this.rideModel.findByIdAndUpdate(
                    rideId,
                    {
                        driver: null,
                        rideStatus: reqBody.rideStatus,
                    },
                    { new: true },
                );
            } else {
                // if user's passenger, they can't mark a ride as
                // accepted or completed
                if (
                    user.role === "passenger" &&
                    (reqBody.rideStatus === "accepted" ||
                        reqBody.rideStatus === "completed")
                ) {
                    return new ForbiddenException(
                        "Passengers can't mark rides as accepted or completed.",
                    );
                }

                ride = await this.rideModel.findByIdAndUpdate(
                    rideId,
                    { rideStatus: reqBody.rideStatus },
                    { new: true },
                );
            }

            if (!ride) return new NotFoundException("Ride not found.");

            return ride;
        } catch (_) {
            return new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }
}
