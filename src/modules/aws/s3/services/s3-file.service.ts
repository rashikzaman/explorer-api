import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3FileService {
  constructor(private readonly configService: ConfigService) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string, folder = null) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET'),
        Body: dataBuffer,
        Key: folder
          ? `${folder}/${uuid()}-${filename}`
          : `${uuid()}-${filename}`,
      })
      .promise();
    return uploadResult;
  }
}
