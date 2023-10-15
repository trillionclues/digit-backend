const asyncHandler = require("express-async-handler");
const {
  createNewBlog,
  handleUpdateBlog,
  getSingleBlog,
  handleGetAllBlogs,
  handleDeleteBlog,
  handleLikedBlog,
  handleDislikedBlog,
  handleUploadBlogImages,
} = require("../Service/Blog/blogService");

// create new blog
const createBlogPost = asyncHandler(async (req, res) => {
  try {
    // create new blog object
    const newBlog = await createNewBlog(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// update blog
const updateBlogPost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBlog = await handleUpdateBlog(id, req.body);
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single blog
const getBlogPost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const getBlog = await getSingleBlog(id);
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await handleGetAllBlogs();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a blog
const deleteBlogPost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await handleDeleteBlog(id);
    res.json({ deletedBlog });
  } catch (error) {
    throw new Error(error);
  }
});

// like a blog
const likeBlogPost = asyncHandler(async (req, res) => {
  try {
    const loginUserId = req?.user?._id; // get id from request
    const { blogId } = req.body;
    // find the exact blog by ID
    const blog = await handleLikedBlog(loginUserId, blogId);
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

// dislike a blog post
const dislikeBlogPost = asyncHandler(async (req, res) => {
  try {
    const loginUserId = req?.user?._id; // get  id from request
    const { blogId } = req.body;
    const blog = await handleDislikedBlog(loginUserId, blogId);
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

// upload blog images
const uploadBlogImages = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const fileQuery = req.files;
    const findBlog = await handleUploadBlogImages(id, fileQuery);

    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogPost,
  updateBlogPost,
  getBlogPost,
  deleteBlogPost,
  getAllBlogs,
  likeBlogPost,
  dislikeBlogPost,
  uploadBlogImages,
};
