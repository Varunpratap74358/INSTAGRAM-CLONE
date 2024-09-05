import multer from 'multer'

const upload = multer({
    Storage:multer.memoryStorage(),
})

export default upload