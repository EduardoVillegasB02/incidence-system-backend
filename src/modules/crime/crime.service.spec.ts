import { Test, TestingModule } from '@nestjs/testing';
import { CrimeService } from './crime.service';

describe('CrimeService', () => {
  let service: CrimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrimeService],
    }).compile();

    service = module.get<CrimeService>(CrimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
