import { Test, TestingModule } from "@nestjs/testing";
import { RidesController } from "./rides.controller";
import { RidesService } from "./rides.service";
import { getModelToken } from "@nestjs/mongoose";
import { Ride } from "./schemas/rides.schema";
import { UsersService } from "../users/users.service";
import { User } from "../users/schemas/users.schema";
import { MockUserModel, MockRideModel } from "../test-utils/test-mock.models";

describe("RidesController", () => {
    let controller: RidesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RidesController],
            providers: [
                RidesService,
                UsersService,

                // ride model
                {
                    provide: getModelToken(Ride.name),
                    useValue: MockRideModel,
                },

                // user model
                {
                    provide: getModelToken(User.name),
                    useValue: MockUserModel,
                },
            ],
        }).compile();

        controller = module.get<RidesController>(RidesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
