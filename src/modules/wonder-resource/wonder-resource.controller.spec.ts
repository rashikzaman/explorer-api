import { Test, TestingModule } from '@nestjs/testing';
import { WonderResourceController } from './wonder-resource.controller';
import { WonderResourceService } from './wonder-resource.service';

describe('WonderResourceController', () => {
  let controller: WonderResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WonderResourceController],
      providers: [WonderResourceService],
    }).compile();

    controller = module.get<WonderResourceController>(WonderResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
