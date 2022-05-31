
const mongoose=require('mongoose');

const schema=mongoose.Schema({
    
      content:{
          type:String,
      },
      sender:{
          type:mongoose.Schema.ObjectId,
          required:true,
      },
      receiver:{
          type:mongoose.Schema.ObjectId,
          required:true,
      }
},{timestamps:true});

const Message=mongoose.model('Message',schema);

module.exports=Message;