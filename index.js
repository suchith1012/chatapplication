// import express from "express";
const express = require("express");
//import "babel-polyfill";
//import cors from "cors";
const cors = require("cors");
const env = require("./env");
//import env from "./env";
const userRoute = require("./app/routes/userRoute")
//import userRoute from "./app/routes/userRoute";
const friendRoute = require("./app/routes/friendRoute")
//import friendRoute from "./app/routes/friendRoute";
const { addinglist, getlistsocket } = require("./app/helpers/global");
//import { addinglist, getlistsocket } from "./app/helpers/global";
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
//const socketRoute = require('./app/routes/socketRoute')(io);
// Add middleware for parsing URL encoded bodies (which are usually sent by browser)

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1", userRoute);
app.use("/api/v1", friendRoute);
//app.use('/api/v1',socketRoute);

io.on("connection", (socket) => {
    const list = getlistsocket()
    console.log(list)
  console.log("a user connected :D");
  socket.on("chat message", (msg) => {
    console.log(msg);
    io.emit("chat message", msg);
  });
});


server.listen(3004 ).on("listening", () => {
  console.log(`🚀 are live on 3004`);
});

export default app;
