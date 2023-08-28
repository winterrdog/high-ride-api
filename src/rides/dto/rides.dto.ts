import { Location } from "../rides.interface";

export class CreateRideDto {
    readonly pickupLocation: Location;
    readonly dropoffLocation: Location;
}

export class UpdateRideStatusDto {
    readonly rideStatus: "accepted" | "completed" | "canceled";
}
