const {server} = require('./server');

const socketIo=require('socket.io');
const io=socketIo(server,{
  cors:{
    origin:"*"
  }
});

io.on('connection',socket=>{
     socket=socket;
})
module.exports=io;