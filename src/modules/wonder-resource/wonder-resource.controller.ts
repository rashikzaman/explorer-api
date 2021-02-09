import { Controller } from '@nestjs/common';
import { WonderResourceService } from './wonder-resource.service';

@Controller('wonder-resource')
export class WonderResourceController {
  constructor(private readonly wonderResourceService: WonderResourceService) {}
}
