var mongoClient = require("mongodb").MongoClient;
var messageObj = require("./messageManagement");

function newUserJoin(id, username, roomName, socket, obj, io) {
    var user = { id, username, roomName };
    mongoClient.connect("mongodb://127.0.0.1:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) console.log("error connecting to server from userinfo");
        else {
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error finding collection from userinfo");
                } else {
                    coll.insertOne(user);
                    messageObj.postMessage(obj);
                    socket.to(obj.roomName).broadcast.emit("modifyUserJoinMessage", obj);
                    getAllUsers(obj.roomName, (p1) => {
                        if (p1.length == 0) {
                            console.log("no users");
                        } else {
                            if (p1[0].error) {
                                console.log(p1[0].error);
                            } else {
                                var userArr = p1.map(item => item);
                                io.to(obj.roomName).emit("DisplayAllUsers", userArr);
                            }
                        }
                    });
                }
            });
        }
    });
}

function getAllUsers(roomName, returnResult) {
    mongoClient.connect("mongodb://127.0.0.1:27017/", (err, dbHost) => {
        if (err) console.log("error connecting to server from userinfo");
        else {
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error connecting to the db and collectuion", err);
                    returnResult({ error: err });
                } else {
                    coll.find({ roomName: roomName }, { username: 1, _id: 0 }).toArray((err, dataArr) => {
                        if (err) {
                            console.log("err");
                            returnResult({ error: err });
                        } else {
                            var userArr = dataArr.map(item => item.username);
                            returnResult(userArr);
                        }
                    });
                }
            });
        }
    });
}

function getUser(id) {
    mongoClient.connect("mongodb://127.0.0.1:27017/", (err, dbHost) => {
        if (err) console.log("error connecting to server from userinfo");
        else {
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error finding collection from userinfo")
                } else {
                    dbHost = coll.findOne({ id: "id" });
                }
            });
        }
    });

}

function removeUser(socket, io) {
    var id = socket.id;
    mongoClient.connect("mongodb://127.0.0.1:27017/", (err, dbHost) => {
        if (err) console.log("error connecting to server from userinfo");
        else {
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error finding collection from userinfo")
                } else {

                    coll.findOne({id:id},(err,res1) => {
                        if (err) console.log(err) ;
                        else {
                            // console.log(res1);
                            var temp = res1 ;
                            // console.log(temp);
                            var obj = { username: temp.username, message: "has left the room", roomName: temp.roomName };
                            coll.findOneAndDelete({id:id}, (err,result)=>{
                                if (err) console.log(err) ;
                                else {
                                    socket.to(temp.roomName).broadcast.emit("modifyUserJoinMessage", obj);
                                    messageObj.postMessage(obj);
                                    getAllUsers(obj.roomName, (p1) => {
                                        if (p1.length == 0) {
                                            console.log("no users");
                                        } else {
                                            if (p1[0].error) {
                                                console.log(p1[0].error);
                                            } else {
                                                var userArr = p1.map(item => item);
                                                io.to(obj.roomName).emit("DisplayAllUsers", userArr);
                                            }
                                        }
                                    });
                                }
                            })
                        }
                    }) ;
                }
            });
        }
    });
}
module.exports = { newUserJoin, getAllUsers, getUser, removeUser };