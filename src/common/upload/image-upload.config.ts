import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const ImageUploadInterceptor = FileInterceptor('image', {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          'Only JPEG, PNG and WebP images are allowed',
        ),
        false,
      );
    }

    callback(null, true);
  },
});