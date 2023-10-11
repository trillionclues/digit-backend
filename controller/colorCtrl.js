const asyncHandler = require("express-async-handler")
const { validateMongoDBId } = require('../utils/validateMongoId');
const Color = require('../models/colorModel')

// create new color
const createColor = asyncHandler(async(req, res) => {
    try {
        const newColor = await Color.create(req.body)
        res.json(newColor)
    } catch (error) {
        throw new Error(error)
    }
})


// update color
const updateColor = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)

    try {
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedColor)
    } catch (error) {
        throw new Error(error)
    }
})

// get a single color
const getSingleColor = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const getColor = await Color.findById(id)
        res.json(getColor)
    } catch (error) {
        throw new Error(error)
    }
})


// get all colors
const getAllColor = asyncHandler(async(req, res) => {
    try {
        const getColors = await Color.find()
        res.json(getColors)
    } catch (error) {
        throw new Error(error)
    }
})
// delete color category
const deleteColor = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const deletedColor = await Color.findByIdAndDelete(id)
        res.json({deletedColor})
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createColor, updateColor, getSingleColor, getAllColor, deleteColor}