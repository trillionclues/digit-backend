const BlogCategory = require('../models/blogCatModel')
const asyncHandler = require("express-async-handler")
const { validateMongoDBId } = require('../utils/validateMongoId');

// create new blog category
const createBlogCategory = asyncHandler(async(req, res) => {
    try {
        const newCategory = await BlogCategory.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})


// update blog category
const updateBlogCategory = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)

    try {
        const updatedBlogCat = await BlogCategory.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBlogCat)
    } catch (error) {
        throw new Error(error)
    }
})

// get a single blog category
const getSingleBlogCategory = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const getCategory = await BlogCategory.findById(id)
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
})


// get all blog categories
const getAllCategories = asyncHandler(async(req, res) => {
    try {
        const getCats = await BlogCategory.find()
        res.json(getCats)
    } catch (error) {
        throw new Error(error)
    }
})
// delete blog category
const deleteBlogCategory = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const deletedCat = await BlogCategory.findByIdAndDelete(id)
        res.json({deletedCat})
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createBlogCategory, updateBlogCategory, deleteBlogCategory, getSingleBlogCategory, getAllCategories}