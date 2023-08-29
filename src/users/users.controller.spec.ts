import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "./schemas/users.schema";
import { MockUserModel } from "../test-utils/test-mock.models";

describe("UsersController", () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                AuthService,
                JwtService,

                // user model
                {
                    provide: getModelToken(User.name), // Use the token for User schema
                    useValue: MockUserModel, // Provide the mock model class
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
