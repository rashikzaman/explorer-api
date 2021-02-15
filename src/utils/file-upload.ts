import { BadRequestException } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

export const RESOURCE_IMAGE_PATH = './public/uploads/resources/images';
export const RESOURCE_AUDIO_CLIP_PATH =
  './public/uploads/resources/audio-clips';

export const resourceFileFilter = (req, file, callback) => {
  if (file.fieldname === 'image') {
    return imageFileFilter(req, file, callback);
  } else if (file.fieldname === 'audioClip') {
    callback(null, true);
  }
};

export const resourceFileDestinationUploader = (req, file, callback) => {
  if (file.fieldname === 'image') {
    callback(null, RESOURCE_IMAGE_PATH);
  } else if (file.fieldname === 'audioClip') {
    callback(null, RESOURCE_AUDIO_CLIP_PATH);
  }
};

/**
 * Only allow image type file
 * @param req
 * @param file
 * @param callback
 */
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException({ message: 'Only image files are allowed' }),
      false,
    );
  }
  callback(null, true);
};

/**
 * Rename the uploaded file with timestamps and original extension
 * @param req
 * @param file
 * @param callback
 */
export const updateFileName = (req, file, callback) => {
  const filename = Date.now() + path.extname(file.originalname);
  callback(null, filename);
};

// export const resourceFileUploadInterceptor = FileInterceptor()

export const imageFileUploadInterceptor = FileInterceptor('image', {
  storage: diskStorage({
    destination: RESOURCE_IMAGE_PATH,
    filename: updateFileName,
  }),
  fileFilter: imageFileFilter,
});

export const audioFileUploadInterceptor = FileInterceptor('audioClip', {
  storage: diskStorage({
    destination: RESOURCE_AUDIO_CLIP_PATH,
    filename: updateFileName,
  }),
});

export const resourceFileUploadInterceptor = FileFieldsInterceptor(
  [
    { name: 'image', maxCount: 1 },
    { name: 'audioClip', maxCount: 1 },
  ],
  {
    storage: diskStorage({
      destination: resourceFileDestinationUploader,
      filename: updateFileName,
    }),
  },
);
