var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var http = require("http");
var socketio = require("socket.io");
var queryString = require("querystring");
var userObj = require("./utils/userInfo");
var messageObj = require("./utils/messageManagement");
const PORT = 3001;

var app = express();
const server = http.createServer(app);
var io = socketio(server);


app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    var loginUrl = path.join(__dirname, "public", "login.html");
    res.sendFile(loginUrl);
})
app.post("/home", (req, res) => {
    var username = req.body.username;
    var room = req.body.room;
    var password = req.body.password;
    var temp1 = queryString.stringify({ username: username, roomName: room });
    //var temp = queryString.stringify({ roomName: room });
    res.redirect("/chat?" + temp1);
})
app.get("/chat", (req, res) => {
    var ChatUrl = path.join(__dirname, "public", "home.html");
    res.sendFile(ChatUrl);
})

io.on("connection", (socket) => {
    socket.on("joinRoom", function(data) {
        socket.join(data.roomName);
        //   console.log(data);
        var obj = { username: data.username, message: "has joined", roomName: data.roomName };
        userObj.newUserJoin(socket.id, obj.username, obj.roomName, socket, obj, io);
    })
    socket.on("message", obj => {
        // console.log("message", obj);
        messageObj.postMessage(obj);
        io.to(obj.roomName).emit("chatmessage", obj);
    })
    socket.on("disconnect", () => {
        // var tempUser = userObj.getUser(socket.id);
        //  console.log(socket.id);
        //   if (tempUser) {
        // var obj = { username: tempUser.username, message: "has left the room", roomName: tempUser.roomName };
        userObj.removeUser(socket, io);
        // io.emit("DisplayAllUsers", (userObj.getAllUsers()));
        //  socket.to(tempUser.roomName).broadcast.emit("modifyUserJoinMessage", obj);
        // messageObj.postMessage(obj);
        // }
    })
})
server.listen(PORT, (err) => {
    if (!err) console.log("successful server");
})