import dotenv from 'dotenv';
dotenv.config();


import connect from './db.js'
connect();


import http from 'http';
import app from './app.js';

const server = http.createServer(app);

const PORT = process.env.PORT||3000;

server.listen(PORT,(req,res)=>{
    console.log("server connected");
})