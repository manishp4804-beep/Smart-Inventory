const express=require('express')
const authMiddleware = require('../Middleware/authMiddleware')
const { addSupplier, getSupplier, updateSupplier,deleteSupplier } = require('../controllers/SupplierController')

const router=express.Router()

router.post("/add",authMiddleware,addSupplier)
router.get("/",authMiddleware,getSupplier)
router.put("/:id",authMiddleware,updateSupplier)
router.delete("/:id",authMiddleware,deleteSupplier)
module.exports=router