const express = require("express")
const router = express.Router()
const {createColor, updateColor, deleteColor, getSingleColor, getAllColor}  = require('../controller/colorCtrl')
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")

// color routes
router.post('/', authMiddleware, isAdmin, createColor)
router.put('/:id', authMiddleware, isAdmin, updateColor)

// Dynamic routes
router.get('/', getAllColor)
router.get('/:id', getSingleColor)
router.delete('/:id',authMiddleware, isAdmin, deleteColor)

module.exports = router
