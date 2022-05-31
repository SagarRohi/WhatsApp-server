const express=require('express');
const User = require('../models/user');
const router=express.Router();
const io=require('../socket');
const Message=require('../models/message');
const mongoose=require('mongoose');
router.post('/create',(req,res)=>{
    
     const {phone,username,password}=req.body;
     User.findOne({phone},(err,user)=>{
         if(err){
              return res.json({
                 success:false,
                 user:null,
                 message:'',
             });
         }
        if(user){
            return res.json({
                success:false,
                user:null,
                message:'Phone Number Already Exist',
            });
        }
        User.create({phone,username,password,},(err,user)=>{
            if(err){
                return res.json({
                    success:false,
                    user:null,
                });
            }
            return res.json({
                success:true,
                user
            })
        })
     })
})



router.post('/authenticate',async(req,res)=>{
   try {
    const {phone,password}=req.body;
    const user=await User.findOne({phone}).populate({
        path:'contacts',
        model:'User'
    })

    if(!user||user.password!==password) return res.json({
                    success:false,
                    user:null,
                    message:"Invalid Phone / Password",
                });


    return res.json({
        success:true,
        user:user,
      })
   } catch (error) {
      return res.json({
         success:false,
      })
   } 

})



router.get('/',async(req,res)=>{
       try {
            const {id}=req.query;
            const user=await User.findById(id).populate({
                path:'contacts',
                model:'User',
            });
            return res.json({
                user:user,
            })
       } catch (error) {
            return res.json({
                success:false,
           })
       }
})



router.post('/delete',async(req,res)=>{
    try{
         const {sender,receiver}=req.body;
         await Message.deleteMany({sender:sender,receiver:receiver});
         await Message.deleteMany({sender:receiver,receiver:sender});
         await User.findByIdAndUpdate(sender,{'$pull':{'contacts':mongoose.Types.ObjectId(receiver)}});
         await User.findByIdAndUpdate(receiver,{'$pull':{'contacts':mongoose.Types.ObjectId(sender)}});
         const senderUser=await User.findById(sender).populate({
             path:'contacts',
             model:'User',
         });
         const receiverUser=await User.findById(receiver).populate({
             path:'contacts',
             model:'User',
         });;
         const deletedYouEvent=`deletedYou_${receiverUser.phone}`;
         io.emit(deletedYouEvent,{you:receiverUser,deleter:senderUser});
         const deletedByEvent=`deletedBy_${senderUser.phone}`;
         io.emit(deletedByEvent,{you:senderUser,deleted:receiverUser});
         return res.json({
             success:true,
         })

    }catch(err){
         return res.json({
             success:false,
         })
    }

})



router.post('/addcontact',async(req,res)=>{
    const {sender,receiver}=req.body;
   try{
    const receiverUser=await User.findOne({phone:receiver}).populate({
        path:'contacts',
        model:'User',
    });
    if(!receiverUser){
                return res.json({
                    failure:true,
                    message:"Contact Does Not Exist",
                })
            }
    const senderUser=await User.findOne({phone:sender}).populate({
        path:'contacts',
        model:'User',
    });




    const addedUser=senderUser.contacts.filter((contact)=>contact.phone===receiver);
    if(addedUser.length>0) return res.json({
                    success:true,
                });

     

    senderUser.contacts.push(receiverUser);
    senderUser.save();
    receiverUser.contacts.push(senderUser);
    receiverUser.save();
    let event=`addedYou_${receiverUser.phone}`;
    io.emit(event,senderUser);
    event=`addedBy_${senderUser.phone}`;
    io.emit(event,receiverUser);
    return res.json({
        success:true,
        receiverUser,
        senderUser
    })           


   }catch(err){
    return res.json({
    success:false,
    message:"Something Went Wrong",
     });
 }



})

module.exports=router;