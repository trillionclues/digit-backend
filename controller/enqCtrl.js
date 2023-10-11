const Enquiry = require('../models/enqModel')
const asyncHandler = require("express-async-handler")
const { validateMongoDBId } = require('../utils/validateMongoId');

    // create new enquiry
    const createEnquiry = asyncHandler(async(req, res) => {
        try {
            const newEnq = await Enquiry.create(req.body)
            res.json(newEnq)
        } catch (error) {
            throw new Error(error)
        }
    })

    // update enquiry
const updateEnquiry = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)

    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

    // delete enquiry
const deleteEnquiry = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id)
        res.json({deletedEnquiry})
    } catch (error) {
        throw new Error(error)
    }
})

// get a single enquiry
const getSingleEnquiry = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const getEnquiry = await Enquiry.findById(id)
        res.json(getEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

// get all enquiries
const getAllEnquiry = asyncHandler(async(req, res) => {
    try {
        const getEnquirys = await Enquiry.find()
        res.json(getEnquirys)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createEnquiry, deleteEnquiry, getSingleEnquiry, getAllEnquiry, updateEnquiry}