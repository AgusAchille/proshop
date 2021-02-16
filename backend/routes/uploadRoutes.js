import express from 'express'
import multer from 'multer'
import path from 'path'

const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});

function fileFilter(req, file, cb) {
    const filetypes = /jpg|png|jpeg/i;
    const extMatch = filetypes.test(path.extname(file.originalname));
    const mimetypeMatch = filetypes.test(file.mimetype);

    if(extMatch && mimetypeMatch)
        cb(null, true);
    else
        cb(new Error('You can only upload images'));
}

const upload = multer({
    storage,
    fileFilter
})

router.post('/', upload.single('image'), (req, res) => {
    res.send(`/${req.file.path}`)
})

export default router;