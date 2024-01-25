import mongoose from 'mongoose';
import UserModel from './user.schema.js';

const connectDb  = async()=>{
    try{
        return await mongoose.connect("mongodb://localhost:27017/csvupload", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (err){
        console.log(err);
    }
    
}

export {connectDb, UserModel}