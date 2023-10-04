const express = require("express")
const router = express.Router()
const {createProdCategory, updateProdCategory, deleteProdCategory, getSingleProdCategory, getAllCategories}  = require('../controller/prodCategoryCtrl')
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")


// category routes
router.post('/', authMiddleware, isAdmin, createProdCategory)
router.put('/:id', authMiddleware, isAdmin, updateProdCategory)

// Dynamic routes
router.get('/', getAllCategories)
router.get('/:id', getSingleProdCategory)
router.delete('/:id',authMiddleware, isAdmin, deleteProdCategory)

module.exports = router
