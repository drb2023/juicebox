require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();

// MORGAN
const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json())

// MIDDLEWARE
server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

// API ROUTER
const apiRouter = require('./api');
server.use('/api', apiRouter);

// CONNECT CLIENT
const { client } = require('./db');
client.connect();

// SERVER START UP
server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});