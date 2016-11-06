var mongodb = require('mongodb');
var JM = require("jm-utilities");
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var defaultServerName = "localhost:27017";
var defaultDatabaseName = "test";
var db = undefined;
module.exports.connect = function (databaseName, serverName) {
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
module.exports.close = function () {
    if (JM.IsDefined(db)) {
        db.close();
    }
};
//# sourceMappingURL=app.js.map