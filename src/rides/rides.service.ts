import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ride } from "./schemas/rides.schema";

@Injectable()
export class RidesService {
    constructor(@InjectModel(Ride.name) private rideModel: Model<Ride>) {}

    // define all methods to retrive data from db
}
