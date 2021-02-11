import { Controller } from '@nestjs/common';
import { VisibilityService } from '../services/visibility.service';

@Controller('visibility')
export class VisibilityController {
  constructor(private readonly visibilityService: VisibilityService) {}
}
