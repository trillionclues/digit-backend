const multer = require("multer") // handle multipart form data
const sharp = require("sharp") // handle image formatting 
const path = require('path')


// multer storage...first locally and then to the cloud
const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "../public/images"))
    },
    filename: function(req, file, cb){
        // create filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + ".jpeg") 
    }
})

// multer filter
const multerFilter = (req, file,cb) => {
    if (file.mimetype.startsWith('image')){
        cb(null, true)
    }
    else{
        cb({
            message: "Unsupported file format"
        }, false)
    }
}

// upload photo props
const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 2000000}
})

// product resize
const productImgResize = async (req, res, next) => {
    if (!req.files) return next();

    // else
    await Promise.all(req.files.map(async(file) => {
        await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/images/products/${file.filename}`)
    } ));
    next();
}

// blog resize
const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();

    // else
    await Promise.all(req.files.map(async(file) => {
        await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/images/blogs/${file.filename}`)
    } ));
    next()
}

module.exports = {uploadPhoto, productImgResize, blogImgResize}