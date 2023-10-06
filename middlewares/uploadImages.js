const multer = require("multer") // handle multipart form data
const sharp = require("sharp") // handle image formatting 
const path = require('path')


// multer storage
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
            message: "Unsupported file formt"
        }, false)
    }
}

// upload photo props
const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 2000000}
})

module.exports = {uploadPhoto}