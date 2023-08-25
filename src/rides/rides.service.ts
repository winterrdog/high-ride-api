import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ride } from "./schemas/rides.schema";

@Injectable()
export class RidesService {
    constructor(@InjectModel(Ride.name) private rideModel: Model<Ride>) {}

    // todo: add pagination
    // get all rides
    async queryAllRides(): Promise<Ride[]> {
        try {
            const rides = await this.rideModel.find();
            if (!rides) {
                throw new NotFoundException("No rides found.");
            }

            return rides;
        } catch (_) {
            throw new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // create a new ride
    async createRide(ride: Ride): Promise<Ride> {
        try {
            const newRide = new this.rideModel(ride);

            return await newRide.save();
        } catch (_) {
            throw new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // update a ride's status
    async updateRideStatus(rideId: string, rideStatus: string): Promise<Ride> {
        try {
            const ride = await this.rideModel.findByIdAndUpdate(
                rideId,
                { rideStatus },
                { new: true },
            );
            if (!ride) {
                throw new NotFoundException("Ride not found.");
            }

            return ride;
        } catch (_) {
            throw new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }
}
