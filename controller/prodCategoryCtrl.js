const ProdCategory = require('../models/prodCategoryModel')
const asyncHandler = require("express-async-handler")
const { validateMongoDBId } = require('../utils/validateMongoId');

// create new category
const createProdCategory = asyncHandler(async(req, res) => {
    try {
        const newCategory = await ProdCategory.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})


// update category
const updateProdCategory = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)

    try {
        const updatedProdCat = await ProdCategory.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedProdCat)
    } catch (error) {
        throw new Error(error)
    }
})

// get a single category
const getSingleProdCategory = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const getCategory = await ProdCategory.findById(id)
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
})


// get all categories
const getAllCategories = asyncHandler(async(req, res) => {
    try {
        const getCats = await ProdCategory.find()
        res.json(getCats)
    } catch (error) {
        throw new Error(error)
    }
})
// delete category
const deleteProdCategory = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const deletedCat = await ProdCategory.findByIdAndDelete(id)
        res.json({deletedCat})
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createProdCategory, updateProdCategory, deleteProdCategory, getSingleProdCategory, getAllCategories}