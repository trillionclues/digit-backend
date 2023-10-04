const express = require("express")
const router = express.Router()
const {createBlogCategory, updateBlogCategory, deleteBlogCategory, getSingleBlogCategory, getAllCategories}  = require('../controller/blogCatCtrl')
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")


// category routes
router.post('/', authMiddleware, isAdmin, createBlogCategory)
router.put('/:id', authMiddleware, isAdmin, updateBlogCategory)

// Dynamic routes
router.get('/', getAllCategories)
router.get('/:id', getSingleBlogCategory)
router.delete('/:id',authMiddleware, isAdmin, deleteBlogCategory)

module.exports = router
