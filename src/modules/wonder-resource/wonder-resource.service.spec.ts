import { Test, TestingModule } from '@nestjs/testing';
import { WonderResourceService } from './wonder-resource.service';

describe('WonderResourceService', () => {
  let service: WonderResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WonderResourceService],
    }).compile();

    service = module.get<WonderResourceService>(WonderResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
