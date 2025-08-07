import { Test, TestingModule } from '@nestjs/testing';
import { HunterController } from './hunter.controller';

describe('HunterController', () => {
  let controller: HunterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HunterController],
    }).compile();

    controller = module.get<HunterController>(HunterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
