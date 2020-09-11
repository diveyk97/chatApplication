var chatForm = document.getElementById("loginForm");
var chatMessage = document.getElementById("txtChatMessage");
var chatMessagesDiv = document.getElementById("chatMessagesDiv");
var messageSent = document.getElementById("textareaText");
var userList = document.getElementById("UserList");
const socket = io();
Qs.parse(location.search);
var userObject = Qs.parse(location.search, { ignoreQueryPrefix: true });
var username = userObject.username;
var roomName = userObject.roomName;
socket.emit("joinRoom", { username: username, roomName: roomName });

function formatMessage(obj) {
    var paraElement = document.createElement("h6");
    var str = obj.username + " : " + obj.message;
    var pTextNode = document.createTextNode(str);
    paraElement.appendChild(pTextNode);
    chatMessagesDiv.appendChild(paraElement);
}
socket.on("DisplayAllUsers", (obj) => {
    userList.innerHTML = "";
    for (var i = 0; i < obj.length; i++) {
        var paraElement = document.createElement("h6");
        var user = obj[i];
        // console.log(user);
        var pTextNode = document.createTextNode(user);
        paraElement.appendChild(pTextNode);
        userList.appendChild(paraElement);
    }
})

function sendMessageEventHandler() {
    socket.emit("message", { message: chatMessage.value, username: username, roomName: roomName });
}
socket.on("chatmessage", (obj) => {
    formatMessage(obj);
})
socket.on("modifyUserJoinMessage", (obj) => {
    var paraElement = document.createElement("p");
    var str = obj.username + "  " + obj.message;
    var pTextNode = document.createTextNode(str);
    paraElement.appendChild(pTextNode);
    chatMessagesDiv.appendChild(paraElement);
    console.log("inside modifyUserJoinMessage")
})