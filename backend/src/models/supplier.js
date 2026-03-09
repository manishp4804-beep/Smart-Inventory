const mongoose=require('mongoose')

const supplierSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const supplierModel=mongoose.model("supplier",supplierSchema)
module.exports=supplierModel