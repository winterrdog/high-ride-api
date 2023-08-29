import mongoose, { Model } from "mongoose";
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/users.schema";
import { CreateUserDto, UpdateDriverStatusDto } from "./dto/users.dto";
import { IJwtPayload } from "../auth/auth.interface";
import { Request } from "express";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    // create a new user
    async createUser(user: CreateUserDto) {
        try {
            // check to see if user already exists
            {
                const existingUser = await this.userModel.findOne({
                    email: user.email,
                });
                if (existingUser) {
                    return new ForbiddenException("User already exists.");
                }
            }

            const newUser = new this.userModel({
                ...user,
                driverStatus: "not applicable",
            });

            return await newUser.save();
        } catch (_) {
            return new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // find a single user by id
    async queryUserById(userId: string) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                return new NotFoundException("User not found.");
            }

            return user;
        } catch (_) {
            return new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // find user from request object
    async queryUserFromRequest(req: Request) {
        try {
            const { sub: userId } = req.user as IJwtPayload;
            const user = await this.queryUserById(userId);
            if (!user) {
                return new NotFoundException("User not found.");
            }

            // rethrow error
            if (user instanceof Error) {
                return user;
            }

            return user;
        } catch (_) {
            return new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // find a single user by email
    async queryUserByEmail(email: string) {
        try {
            const user = this.userModel.findOne({ email });
            if (!user) {
                return new NotFoundException("User not found");
            }

            return user;
        } catch (_) {
            return new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // update a driver's status
    async updateDriverStatus(userId: string, reqData: UpdateDriverStatusDto) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                return new NotFoundException("User not found.");
            }

            // update driver's status
            user.driverStatus = reqData.driverStatus;

            return await user.save();
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                return new BadRequestException("Invalid driver status issued");
            }

            return new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }
}
