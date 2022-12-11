const mongoose = require("mongoose");
const config = require("../../configs/config.js");

const connect = async() =>{
    await mongoose.connect(config.database.mongoDB.URI, config.database.mongoDB.options).then(() =>{
        console.log("[Database] MongoDB : Connected");
    }, (err) =>{
        console.log(`[Database] MongoDB : Cannot connect to database ERROR : ${err}`);
    });
}

exports.connect = connect;