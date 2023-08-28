import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Location } from "../rides.interface";
import { User } from "../../users/schemas/users.schema";

export type RideDocument = mongoose.HydratedDocument<Ride>;

@Schema({
    strictQuery: true,
    timestamps: true,
    toJSON: {
        transform: rideJsonTransformer,
    },
})
export class Ride {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: [true, "Please provide the passenger's id"],
    })
    passenger: User;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        default: null,
    })
    driver: User;

    @Prop({
        required: [true, "Please provide the passenger's current location"],
        type: Location,
    })
    pickUpLocation: Location;

    @Prop({
        type: Location,
        required: [true, "Please provide the passenger's destination"],
    })
    dropOffLocation: Location;

    @Prop({
        required: [true, "Please provide the ride's status"],
        enum: ["pending", "accepted", "completed", "cancelled"],
        default: "pending",
    })
    rideStatus: string;
}

export const RideSchema = SchemaFactory.createForClass(Ride);

// populate passenger and driver fields
RideSchema.pre("find", populateUserMiddleware);
RideSchema.pre("findOne", populateUserMiddleware);
RideSchema.pre("findOneAndUpdate", populateUserMiddleware);

// get a ride's id
RideSchema.virtual("getRideId").get(function () {
    return this._id.toHexString();
});

function populateUserMiddleware(next) {
    this.populate({
        path: "passenger driver",
        select: "firstName lastName phoneNumber role driverStatus",
    });

    next();
}

// controls what is returned when a ride object is converted to JSON
function rideJsonTransformer(doc, ret, options) {
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;

    return ret;
}
