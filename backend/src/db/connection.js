const mongoose=require('mongoose')

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to db")
    }
    catch(e){
        console.error("Connection Failed",e.message);
        process.exit(1)
    }
}

module.exports=connectDB