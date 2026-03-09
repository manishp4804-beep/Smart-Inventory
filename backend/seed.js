const bcrypt = require('bcrypt')
const userModel = require('./src/models/userModels')
const connectDB = require('./src/db/connection')

const register=async()=>{
    try{
        await connectDB()
        const hashedPassword=await bcrypt.hash('admin',10)
        const newUser=new userModel({
            name:'admin',
            email:'admin@gmail.com',
            password:hashedPassword,
            address:'KIIT',
            role:'admin'
        })
        await newUser.save()
        console.log("Admin user created")
    }
    catch(e){
        console.log("Error creating admin user",e.message)
    }
}

register();