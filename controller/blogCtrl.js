const Blog = require('../models/blogModel')
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utils/validateMongoId');
const User = require('../models/userModel')

// create new blog
const createBlogPost = asyncHandler(async(req, res) => {
    try {
        // create new blog object
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// update blog
const updateBlogPost = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// Get a single blog
const getBlogPost = asyncHandler(async(req,res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes')

        // update view count in the blog model
        await Blog.findByIdAndUpdate(id, {
            $inc: {numViews: 1}
        }, {
            new: true
        })
        res.json(getBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// get all blogs
const getAllBlogs = asyncHandler(async(req, res) => {
    try {
        const getBlogs = await Blog.find()
        res.json(getBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

// Delete a blog
const deleteBlogPost = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)

    try {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        res.json({deletedBlog})
    } catch (error) {
        throw new Error(error)
    }
})

// like blog
const likeBlogPost = asyncHandler(async(req, res) => {
    const loginUserId = req?.user?._id // get user id from request
    const {blogId} = req.body
    validateMongoDBId(blogId)

    try {
        
    // find the exact blog by ID
    const blog = await Blog.findById(blogId)
    if (!blog) throw new Error("Blog not found!")

    // check if user has already liked the blog
    const isLiked = blog?.isLiked

    // check if user already disliked the blog
        // toggle isDisliked to false to either add or pull the id out from the disliked array
    const alreadyDisliked = blog?.dislikes?.find((userId => userId?.toString() === loginUserId?.toString()))
    if(alreadyDisliked) {
        // if already disliked, the user cannot dislike the blog again
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        }, {
            new: true
        })
        res.json(updatedBlog)
    }

    // check if user already liked the blog
    // toggle isliked true/false
    if (isLiked) {
         // if user already liked a blog, we remove the user id from likes array
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isLiked: false
        }, {
            new: true
        })
        res.json(updatedBlog)
    }
    else{
        // add user id to isliked array
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: {likes: loginUserId},
            isLiked: true
        }, {
            new: true
        })
        res.json(updatedBlog)
    }

    }
    catch (error) {
        throw new Error(error)
    }
})


// dislike a blog post
const dislikeBlogPost = asyncHandler(async (req, res) => {
    const loginUserId = req?.user?._id; // get user id from request
    const { blogId } = req.body;
    validateMongoDBId(blogId);

    try {
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
            res.json(updatedBlog);
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
            res.json(updatedBlog);
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
            res.json(updatedBlog);
        }
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
    dislikeBlogPost
}