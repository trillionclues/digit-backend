const express = require('express')
const router = express.Router()
const {createBlogPost, updateBlogPost, getBlogPost, deleteBlogPost, getAllBlogs, likeBlogPost, dislikeBlogPost, getOneBlog} = require('../controller/blogCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

// blog controller
router.post('/', authMiddleware, isAdmin, createBlogPost)
router.put('/likes', authMiddleware, likeBlogPost)
router.put('/dislikes', authMiddleware, dislikeBlogPost)
router.put('/:id', authMiddleware, isAdmin, updateBlogPost)

// Dynamic routes
router.get('/', getAllBlogs)
router.get('/:id', getBlogPost)
router.delete('/:id', authMiddleware, isAdmin, deleteBlogPost)


module.exports = router