const express = require("express")
const router = express.Router()
const {createBrand, updateBrand, deleteBrand, getSingleBrand, getAllBrand}  = require('../controller/brandCtrl')
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")


// brand routes
router.post('/', authMiddleware, isAdmin, createBrand)
router.put('/:id', authMiddleware, isAdmin, updateBrand)

// Dynamic routes
router.get('/', getAllBrand)
router.get('/:id', getSingleBrand)
router.delete('/:id',authMiddleware, isAdmin, deleteBrand)

module.exports = router
