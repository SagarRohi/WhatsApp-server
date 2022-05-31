const mongoose=require('mongoose');

const schema=mongoose.Schema({
    
    phone:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    contacts:[{type:mongoose.Schema.ObjectId}],
},{timestamps:true});


const User=mongoose.model('User',schema);

module.exports=User;