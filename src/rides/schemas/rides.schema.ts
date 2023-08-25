import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { ILocation } from "../rides.interface";
import { User } from "../../users/schemas/users.schema";

export type RideDocument = mongoose.HydratedDocument<Ride>;

@Schema({
    strictQuery: true,
    timestamps: true,
    toJSON: {
        transform: function (doc, ret, options) {
            ret.id = ret._id;

            // remove _id, __v from the returned object
            delete ret._id;
            delete ret.__v;

            return ret;
        },
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
    })
    driver: User;

    @Prop({
        required: [true, "Please provide the passenger's current location"],
    })
    pickUpLocation: ILocation;

    @Prop({
        required: [true, "Please provide the passenger's destination"],
    })
    dropOffLocation: ILocation;

    @Prop({
        required: [true, "Please provide the ride's status"],
        enum: ["pending", "accepted", "completed", "canceled"],
        default: "pending",
    })
    rideStatus: string;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
