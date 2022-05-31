require('dotenv').config();
const mongoose=require('mongoose');
const User=require('../models/user');
const io = require('../socket');
const Message =require('../models/message');
mongoose.connect(process.env.DATABASE_URL); // remove
const db=mongoose.connection;

db.on('error',console.error.bind('console',"Error in Connecting To The mongodb"));

db.once('open',()=>{
    console.log('Connected To MongoDB');
    const userCollection=db.collection("users");
    const messageCollection=db.collection('messages');
    const filter={
        $match:{
            opearationType:'insert',
        }
    }
    const changeStream=userCollection.watch({ fullDocument: 'updateLookup' });
    const messageStream=messageCollection.watch(filter,{fullDocument:'updateLookup'});
    changeStream.on("change",async(change)=>{
        const id=change.documentKey._id;
        const user=await User.findById(id).populate({
            path:'contacts',
            model:'User',
        })
        const event=`update_${id}`;
        io.emit(event,{
            user:user
        })  
    })
    messageStream.on('change',async(change)=>{
         const {documentKey}=change;
         const message= await Message.findById(documentKey._id).populate({
             path:'sender',
             model:'User',
         }).populate({
            path:'receiver',
            model:'User',
        })
        const senderEvent=`message_${message?.sender._id}`;
        const receiverEvent=`message_${message?.receiver._id}`;
        io.emit(senderEvent,message);
        io.emit(receiverEvent,message);
    })
})

module.exports=db;

