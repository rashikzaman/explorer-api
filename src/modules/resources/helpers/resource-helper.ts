import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resource } from '../models/entities/resource.entity';

@Injectable()
export class ResourceHelper {
  constructor(private configService: ConfigService) {}

  prepareResourceAfterFetch(resource: Resource) {
    resource.imageLink = this.appendDomainToImageLink(resource);
    resource.audioClipLink = resource.audioClipLink
      ? this.configService.get('AWS_BUCKET_DOMAIN') + resource.audioClipLink
      : null;
    return resource;
  }

  appendDomainToImageLink(resource: Resource): string {
    const imageLink = resource.imageLink
      ? this.configService.get('AWS_CLOUDFRONT_DOMAIN') + resource.imageLink
      : null;
    return imageLink;
  }

  appendDomainToAudionLink(resource: Resource): string {
    const audioClipLink = resource.audioClipLink
      ? this.configService.get('AWS_BUCKET_DOMAIN') + resource.audioClipLink
      : null;
    return audioClipLink;
  }
}
