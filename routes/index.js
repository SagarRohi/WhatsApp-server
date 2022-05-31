const express=require('express');

const router=express.Router();

router.get('/',(req,res)=>{
    return res.json({
        message:"Hello World",
    })
})

router.post('/connect',(req,res)=>{
    return res.json("we all are connected");
})


router.use('/user',require('./user'));
router.use('/message',require('./message'));

module.exports=router;
