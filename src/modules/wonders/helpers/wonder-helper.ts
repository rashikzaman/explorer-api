import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wonder } from '../models/entities/wonder.entity';

@Injectable()
export class WonderHelper {
  constructor(private configService: ConfigService) {}

  prepareWonderAfterFetch(wonder: Wonder) {
    wonder.coverPhotoUrl = wonder.coverPhotoUrl
      ? this.configService.get('AWS_CLOUDFRONT_DOMAIN') + wonder.coverPhotoUrl
      : wonder.coverPhotoUrl;
    return wonder;
  }
}
