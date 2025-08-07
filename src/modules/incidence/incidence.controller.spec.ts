import { Test, TestingModule } from '@nestjs/testing';
import { IncidenceController } from './incidence.controller';
import { IncidenceService } from './incidence.service';

describe('IncidenceController', () => {
  let controller: IncidenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidenceController],
      providers: [IncidenceService],
    }).compile();

    controller = module.get<IncidenceController>(IncidenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
