import multer from 'multer'
import { unprocessable } from '../utils/errors.js'

function memoryStorage() {
  return multer.memoryStorage()
}

export const uploadCsv = multer({
  storage: memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
}).single('file')

export function wrapUpload(middleware) {
  return (req, res, next) => middleware(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(unprocessable('File exceeds the 15MB byte limit'))
      }
      return next(unprocessable(`Upload failed: ${error.message}`))
    }
    next(error)
  })
}
