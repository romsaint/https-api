import { extname } from 'path';
import { diskStorage } from 'multer';
import * as uuid from 'uuid'


export const multerOpt = {
    limits: { fileSize: 1024 * 1024 },
    fileFilter(req, file, callback) {
        const accessExt = ['.jpeg', '.jpg', '.png']

        if (!accessExt.includes(extname(file.originalname))) {
            callback(new Error('Wrong file extension'), false)
        }

        callback(null, true)
    },
    storage: diskStorage({
        filename(req, file, callback) {
            const originalName = file.originalname
            const filename = `${originalName}-${uuid.v4()}${extname(originalName)}`

            callback(null, filename)
        },
        destination: '../uploads'
    })
}