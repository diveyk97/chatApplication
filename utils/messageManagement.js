var mongoClient = require("mongodb").MongoClient;
// messagesArr = [];

function postMessage(obj) {
    mongoClient.connect("mongodb://127.0.0.1:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
            if (err) {
                console.log("error database");
            } else {
                var db = dbHost.db("slDb");
                db.collection("messages", (err, coll) => {
                    if (err) {
                        console.log("srror inside");
                    } else {
                        //  console.log(obj);
                        coll.insertOne(obj);
                    }
                })
            }
        })
        // messagesArr.push(obj);
}

function getAllMessages() {
    //  return messagesArr;
}
module.exports = { postMessage, getAllMessages };