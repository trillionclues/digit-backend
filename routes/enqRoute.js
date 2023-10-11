const express = require("express")
const router = express.Router()
const {createEnquiry, deleteEnquiry, getSingleEnquiry, getAllEnquiry, updateEnquiry}  = require('../controller/enqCtrl')
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")

// enquiry routes
router.post('/', createEnquiry)
router.put('/:id', authMiddleware, isAdmin, updateEnquiry)

// Dynamic routes
router.get('/', getAllEnquiry)
router.get('/:id', getSingleEnquiry)
router.delete('/:id',authMiddleware, isAdmin, deleteEnquiry)

module.exports = router
