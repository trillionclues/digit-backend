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
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id
                },
                {
                    resource_type: "auto"
                }
            );
        });
    });
};

// wrapper function delete images in cloudinary container
const cloudinaryDeleteUpload = async (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Error deleting image from Cloudinary:", error);
          reject(error);
        } else {
          console.log("Image deleted from Cloudinary:", result);
          resolve(result);
        }
      });
    });
  };
  
// const cloudinaryDeleteUpload = async(fileToDelete) => {
//     return new Promise((resolve) => {
//         cloudinary.uploader.destroy(fileToDelete, (result) => {
//             resolve(
//                 {
//                     url: result.secure_url,
//                     asset_id: result.asset_id,
//                     public_id: result.public_id
//                 },
//                 {
//                     resource_type: "auto"
//                 }
//             );
//         });
//     });
// }

module.exports = {cloudinaryImageUpload, cloudinaryDeleteUpload}