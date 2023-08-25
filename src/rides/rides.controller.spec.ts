import { Test, TestingModule } from '@nestjs/testing';
import { RidesController } from './rides.controller';

describe('RidesController', () => {
  let controller: RidesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RidesController],
    }).compile();

    controller = module.get<RidesController>(RidesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
