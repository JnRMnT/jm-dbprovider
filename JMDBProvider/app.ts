import mongodb = require('mongodb');
import JM = require("jm-utilities");

var MongoClient = mongodb.MongoClient;
var assert = require('assert');

var defaultServerName = "localhost:27017";
var defaultDatabaseName = "test";

var db: mongodb.Db = undefined;
module.exports.connect = (databaseName: string, serverName): void => {
    if (JM.IsEmpty(databaseName)) {
        databaseName = defaultDatabaseName;
    }

    if (JM.IsEmpty(serverName)) {
        serverName = defaultServerName;
    }
    var url = 'mongodb://' + databaseName + '/' + databaseName;
    MongoClient.connect(url, function (err, database) {
        assert.equal(null, err);
        db = database;
        console.log("Connected correctly to server.");
    });
};

module.exports.close = (): void => {
    if (JM.IsDefined(db)) {
        db.close();
    }
}
