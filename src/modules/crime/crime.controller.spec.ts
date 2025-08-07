import { Test, TestingModule } from '@nestjs/testing';
import { CrimeController } from './crime.controller';
import { CrimeService } from './crime.service';

describe('CrimeController', () => {
  let controller: CrimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrimeController],
      providers: [CrimeService],
    }).compile();

    controller = module.get<CrimeController>(CrimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
