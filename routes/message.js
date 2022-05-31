const Message =require('../models/message');
const User =require('../models/user');
const express=require('express');
const db=require('../config/mongoose');
const router=express.Router();


router.post('/create', async(req,res)=>{
    const {content,sender,receiver}=req.body;
    const mess=await Message.create({content,sender,receiver});
    return res.json({
        mess
    })
})
const sortByDate = arr => {
    const sorter = (a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    arr.sort(sorter);
    return arr;
};

router.get('/',async(req,res)=>{
    const {sender,receiver}=req.query;
    if(!sender||!receiver) return res.json({
           success:false,
    })
    const result1=await Message.find({sender:sender,receiver:receiver}).populate({
        path:'sender',
        model:'User'
    }).populate({
        path:'receiver',
        model:'User'
    });
    const result2=await Message.find({sender:receiver,receiver:sender}).populate({
        path:'sender',
        model:'User'
    }).populate({
        path:'receiver',
        model:'User'
    });;
    const allMessages=[...result1,...result2];
    const messages=sortByDate(allMessages);
    return res.json({
        messages
    })
})

module.exports=router;
// const result=await Message.find({sender:sender,receiver:receiver});
// console.log(result);
// const senderUser=await User.findById(sender);
// const receiverUser=await User.findById(receiver);
// console.log(senderUser,receiverUser);
// const senderUser=await User.findById(sender);
// const receiverUser=await User.findById(receiver);
// const receiverContact=senderUser.contacts.filter((contact)=>contact.user===receiverUser._id);
// const senderContact=receiverUser.contacts.filter((contact)=>contact.user===senderUser._id);
// console.log(receiverContact,senderContact);
// senderContact.messages.push(mess);
// receiverContact.messages.push(mess);
// senderUser.save();
// receiverUser.save();
// console.log(mess);