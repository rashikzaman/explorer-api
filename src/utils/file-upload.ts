import { BadRequestException } from '@nestjs/common';
import * as path from 'path';

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
