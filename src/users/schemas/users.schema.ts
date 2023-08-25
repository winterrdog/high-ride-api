import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
    strictQuery: true,
    timestamps: true,
    toJSON: {
        transform: function (doc, ret, options) {
            ret.id = ret._id;

            // remove _id, __v, password from the returned object
            delete ret.password;
            delete ret._id;
            delete ret.__v;

            return ret;
        },
    },
})
export class User {
    @Prop({ required: [true, "Please provide the first name."], trim: true })
    firstName: string;

    @Prop({
        required: [true, "Please provide the last name."],
        trim: true,
    })
    lastName: string;

    @Prop({
        required: [true, "Please provide the email address."],
        unique: true,
        trim: true,
        lowercase: true,
    })
    email: string;

    @Prop({
        required: [true, "Please provide the password."],
        trim: true,
    })
    password: string; // password hash will be stored

    @Prop({
        required: [true, "Please provide the phone number."],
        trim: true,
    })
    phoneNumber: string;

    @Prop({
        required: [true, "Please provide the role."],
        enum: ["driver", "passenger"],
        default: "passenger",
    })
    role: string;

    @Prop({
        enum: ["available", "unavailable", "not applicable"],
        default: "not applicable",
    })
    driverStatus: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
