const Brand = require('../models/brandModel')
const asyncHandler = require("express-async-handler")
const { validateMongoDBId } = require('../utils/validateMongoId');

// create new brand
const createBrand = asyncHandler(async(req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})


// update brand
const updateBrand = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)

    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// get a single brand
const getSingleBrand = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const getBrand = await Brand.findById(id)
        res.json(getBrand)
    } catch (error) {
        throw new Error(error)
    }
})


// get all brands
const getAllBrand = asyncHandler(async(req, res) => {
    try {
        const getBrands = await Brand.find()
        res.json(getBrands)
    } catch (error) {
        throw new Error(error)
    }
})
// delete blog category
const deleteBrand = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id)
        res.json({deletedBrand})
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createBrand, updateBrand, deleteBrand, getSingleBrand, getAllBrand}