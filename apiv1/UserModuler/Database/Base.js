const MongoDB = require("mongodb");
const URL = "mongodb://localhost:27017/smartmotel"
const MongoClient = MongoDB.MongoClient;

let connect = await MongoClient(URL);

module.exports = connect;
