const express = require('express');
const router = express.Router();
import { errorMessage, successMessage, status } from "../helpers/status";
module.exports = function(io) {

    //we define the variables
    var sendResponse = function () {};

    io.sockets.on("connection",function(socket){
        // Everytime a client logs in, display a connected message
        console.log("Server-Client Connected!");

        socket.on('connected', function(data) {
            //listen to event at anytime (not only when endpoint is called)
            //execute some code here
        });

        socket.on('chat message', data => {
            console.log(data)
            //calling a function which is inside the router so we can send a res back
            sendResponse(data);
        })     
    });

    router.post('/sendmsg', async (req, res) => {

        //pickedUser is one of the connected client
        var pickedUser = "suchith";
        io.to(pickedUser).emit('chat', req.body);

        sendResponse = function (data) {
            return res.status(status.success).send(successMessage);
        }

    });

    return router;

};