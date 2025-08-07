import { Test, TestingModule } from '@nestjs/testing';
import { IncidenceService } from './incidence.service';

describe('IncidenceService', () => {
  let service: IncidenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidenceService],
    }).compile();

    service = module.get<IncidenceService>(IncidenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
