require('dotenv').config();


const http=require('http');
const express= require('express');
const app=express();
const server=http.createServer(app);

const PORT = process.env.PORT || 8000;

server.listen(PORT,()=>{
    console.log("Listening on port : ",PORT);
})

module.exports = {
    app,
    server
}