import { Test, TestingModule } from "@nestjs/testing";
import { RidesService } from "./rides.service";

describe("RidesService", () => {
    let service: RidesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RidesService],
        }).compile();

        service = module.get<RidesService>(RidesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
