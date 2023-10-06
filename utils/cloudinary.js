const cloudinary = require("cloudinary")

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
})


// wrapper function to upload image to Cloudinary and returns a URL to the uploaded image.
// returns a promise that resolves with the Cloudinary URL.
const cloudinaryImageUpload = async(fileToUpload) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, (result) => {
            resolve(
                {
                    url: result.secure_url
                },
                {
                    resource_type: "auto"
                }
            );
        });
    });
};

module.exports = cloudinaryImageUpload