import { Test, TestingModule } from '@nestjs/testing';
import { WonderController } from './wonder.controller';
import { WonderService } from './wonder.service';

describe('WonderController', () => {
  let controller: WonderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WonderController],
      providers: [WonderService],
    }).compile();

    controller = module.get<WonderController>(WonderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
