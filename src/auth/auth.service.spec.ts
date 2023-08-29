import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "../users/schemas/users.schema";
import { MockUserModel } from "../test-utils/test-mock.models";

describe("AuthService", () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                UsersService,

                // user model
                {
                    provide: getModelToken(User.name),
                    useClass: MockUserModel,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
