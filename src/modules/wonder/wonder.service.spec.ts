import { Test, TestingModule } from '@nestjs/testing';
import { WonderService } from './wonder.service';

describe('WonderService', () => {
  let service: WonderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WonderService],
    }).compile();

    service = module.get<WonderService>(WonderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
