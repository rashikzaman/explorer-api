import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resource } from '../models/entities/resource.entity';

@Injectable()
export class ResourceHelper {
  constructor(private configService: ConfigService) {}

  prepareResourceAfterFetch(resource: Resource) {
    resource.imageLink = resource.imageLink
      ? this.configService.get('AWS_CLOUDFRONT_DOMAIN') + resource.imageLink
      : null;
    resource.audioClipLink = resource.audioClipLink
      ? this.configService.get('AWS_BUCKET_DOMAIN') + resource.audioClipLink
      : null;
    return resource;
  }
}
