const mongoose = require('mongoose')
const connectDB= async ()=>{
    try{
        mongoose.set('strictQuery',false)
        const conn =mongoose.connect(process.env.MONGO_URI)
        console.log(conn)

    }catch(error){

        console.log(error)


    }
}

module.exports=connectDB;