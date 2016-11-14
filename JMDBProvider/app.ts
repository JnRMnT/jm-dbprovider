import mongodb = require('mongodb');
var JM = require("jm-utilities");

var MongoClient = mongodb.MongoClient;
var assert = require('assert');

var defaultServerName = "localhost:27017";
var defaultDatabaseName = "test";

var db: mongodb.Db = undefined;
exports.connect = (databaseName: string, serverName): void => {
    if (JM.IsEmpty(databaseName)) {
        databaseName = defaultDatabaseName;
    }

    if (JM.IsEmpty(serverName)) {
        serverName = defaultServerName;
    }
    var url = 'mongodb://' + serverName + '/' + databaseName;
    MongoClient.connect(url, function (err, database) {
        assert.equal(null, err);
        db = database;
        console.log("Connected correctly to server.");
    });
};

exports.close = (): void => {
    if (JM.IsDefined(db)) {
        db.close();
    }
}
