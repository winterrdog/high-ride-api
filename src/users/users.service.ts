import { Model } from "mongoose";
import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/users.schema";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    // create a new user
    async createUser(user: User): Promise<User> {
        try {
            const newUser = new this.userModel(user);

            return await newUser.save();
        } catch (_) {
            throw new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // find a single user by id
    async queryUserById(userId: string): Promise<User> {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new NotFoundException("User not found.");
            }

            return user;
        } catch (_) {
            throw new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }

    // update a driver's status
    async updateDriverStatus(
        userId: string,
        driverStatus: string,
    ): Promise<User> {
        try {
            // find user and check if it's a driver
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new NotFoundException("User not found.");
            }

            if (user.role !== "driver") {
                throw new ForbiddenException("Only drivers can accept rides.");
            }

            // update driver's status
            user.driverStatus = driverStatus;

            return await user.save();
        } catch (_) {
            throw new InternalServerErrorException(
                "Internal Server Error occurred",
            );
        }
    }
}
