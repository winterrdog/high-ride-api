import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as argon2 from "argon2";

export type UserDocument = HydratedDocument<User>;

@Schema({
    strictQuery: true,
    timestamps: true,
    toJSON: {
        transform: userJsonTransformer,
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

// hash password before saving
UserSchema.pre<UserDocument>("save", hashPasswdMiddleware);

// compare password with that one in database
UserSchema.method("compareDbPassword", async function (password) {
    try {
        return await argon2.verify(this.password, password);
    } catch (error) {
        return false;
    }
});

// get a user's id
UserSchema.virtual("getUserId").get(function () {
    return this._id.toHexString();
});

async function hashPasswdMiddleware(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }

    try {
        // generate a hash
        user.password = await argon2.hash(user.password);

        return next();
    } catch (err) {
        return next(err);
    }
}

// controls what is returned when a user object is converted to JSON
function userJsonTransformer(doc, ret, options) {
    ret.id = ret._id;
    ret.dateCreated = ret.createdAt;
    ret.lastModified = ret.updatedAt;

    delete ret.password;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret._id;
    delete ret.__v;

    return ret;
}
