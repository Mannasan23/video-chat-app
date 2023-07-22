const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
app.use(express.static("public"));

const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

const { ExpressPeerServer } = require("peer");

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});

var ExpressPeerServer = require('peer').ExpressPeerServer; 
var peerExpress = require('express'); 
var peerApp = peerExpress(); 
var peerServer = require('http').createServer(peerApp); 
var options = { debug: true }; 
var peerPort = 3001; peerApp.use('/peerjs', ExpressPeerServer(peerServer, options)); 
peerServer.listen(peerPort);

server.listen(3030);
