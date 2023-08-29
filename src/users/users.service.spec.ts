import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "./schemas/users.schema";
import { MockUserModel } from "../test-utils/test-mock.models";

describe("UsersService", () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,

                // user model
                {
                    provide: getModelToken(User.name),
                    useClass: MockUserModel,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
