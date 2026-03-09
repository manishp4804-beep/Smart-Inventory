const express=require('express')
const {addCategory,getCategories, updateCategory, deleteCategory} = require('../controllers/CategoryController') 
const authMiddleware = require('../Middleware/authMiddleware')
const router=express.Router()
router.post("/add",authMiddleware,addCategory)
router.get("/",authMiddleware,getCategories)
router.put("/:id",authMiddleware,updateCategory)
router.delete("/:id",authMiddleware,deleteCategory)
module.exports=router
