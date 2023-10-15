const Blog = require("../../models/blogModel");
const { cloudinaryImageUpload } = require("../../utils/cloudinary");
const { validateMongoDBId } = require("../../utils/validateMongoId");
const fs = require("fs");

const createNewBlog = async (body) => {
  const newBlog = await Blog.create(body);
  return newBlog;
};

const handleUpdateBlog = async (id, body) => {
  validateMongoDBId(id);
  const updateBlog = await Blog.findByIdAndUpdate(id, body, { new: true });
  return updateBlog;
};

const getSingleBlog = async (id) => {
  validateMongoDBId(id);
  const getBlog = await Blog.findById(id)
    .populate("likes")
    .populate("dislikes");

  await Blog.findByIdAndUpdate(
    id,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );
  return getBlog;
};

const handleGetAllBlogs = async () => {
  const getBlogs = await Blog.find();
  return getBlogs;
};

const handleDeleteBlog = async (id) => {
  validateMongoDBId(id);
  const deleteBlog = await Blog.findByIdAndDelete(id);
  return deleteBlog;
};

const handleLikedBlog = async (loginUserId, blogId) => {
  validateMongoDBId(blogId);

  // find the exact blog by ID
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found!");

  // check if user has already liked the blog
  const isLiked = blog?.isLiked;

  // check if user already disliked the blog
  // toggle isDisliked to false to either add or pull the id out from the disliked array
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyDisliked) {
    // if already disliked, the user cannot dislike the blog again
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    return updatedBlog;
  }

  // check if user already liked the blog
  // toggle isliked true/false
  if (isLiked) {
    // if user already liked a blog, we remove the user id from likes array
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    return updatedBlog;
  } else {
    // add user id to isliked array
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    return updatedBlog;
  }
};

const handleDislikedBlog = async (loginUserId, blogId) => {
  validateMongoDBId(blogId);

  // find the exact blog by ID
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found!");

  // check if user has already disliked the blog
  const isDisliked = blog?.isDisliked;

  // check if user already liked the blog
  // toggle isliked to false to either add or pull the id out from the liked array
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    // If already liked, remove the user id from likes array
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    return updatedBlog;
  }

  // Toggle isDisliked true/false
  if (isDisliked) {
    // If user already disliked a blog, remove the user id from dislikes array
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    return updatedBlog;
  } else {
    // Add user id to dislikes array and set isDisliked to true
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    return updatedBlog;
  }
};

const handleUploadBlogImages = async (id, fileQuery) => {
  validateMongoDBId(id);

  // call cloudinary config
  const uploader = (path) => cloudinaryImageUpload(path, "images");

  // create array from blog image url from request
  const urls = [];

  // map image files and push to array
  for (const file of fileQuery) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath);
    fs.unlinkSync(path);
  }

  // update blog with image schema
  const findBlog = await Blog.findByIdAndUpdate(
    id,
    {
      images: urls.map((file) => {
        return file;
      }),
    },
    {
      new: true,
    }
  );

  return findBlog;
};

module.exports = {
  createNewBlog,
  handleUpdateBlog,
  getSingleBlog,
  handleGetAllBlogs,
  handleDeleteBlog,
  handleLikedBlog,
  handleDislikedBlog,
  handleUploadBlogImages,
};
