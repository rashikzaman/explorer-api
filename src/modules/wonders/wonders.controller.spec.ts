import { Test, TestingModule } from '@nestjs/testing';
import { WondersController } from './wonders.controller';
import { WondersService } from './wonders.service';

describe('WondersController', () => {
  let controller: WondersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WondersController],
      providers: [WondersService],
    }).compile();

    controller = module.get<WondersController>(WondersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
