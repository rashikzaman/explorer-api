import { Test, TestingModule } from '@nestjs/testing';
import { WondersService } from './services/wonders.service';

describe('WondersService', () => {
  let service: WondersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WondersService],
    }).compile();

    service = module.get<WondersService>(WondersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
