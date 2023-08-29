import { Test, TestingModule } from "@nestjs/testing";
import { RidesService } from "./rides.service";
import { UsersService } from "../users/users.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "../users/schemas/users.schema";
import { MockRideModel, MockUserModel } from "../test-utils/test-mock.models";
import { Ride } from "./schemas/rides.schema";

describe("RidesService", () => {
    let service: RidesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RidesService,
                UsersService,

                // user model
                {
                    provide: getModelToken(User.name),
                    useClass: MockUserModel,
                },

                // ride model
                {
                    provide: getModelToken(Ride.name),
                    useClass: MockRideModel,
                },
            ],
        }).compile();

        service = module.get<RidesService>(RidesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
