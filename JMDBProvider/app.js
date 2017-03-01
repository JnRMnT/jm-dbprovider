/// <reference path="Scripts/typings/index.d.ts" />
var mongodb = require('mongodb');
var JM = require("jm-utilities");
var q = require("q");
var JMDbProvider = (function () {
    function JMDbProvider() {
        this.MongoClient = mongodb.MongoClient;
        this.defaultServerName = "localhost:27017";
        ;
        this.defaultDatabaseName = "test";
    }
    JMDbProvider.prototype.connect = function (userName, password, databaseName, serverName) {
        var deferred = q.defer();
        if (!JM.isDefined(this.db)) {
            if (JM.isEmpty(databaseName)) {
                databaseName = this.defaultDatabaseName;
            }
            if (JM.isEmpty(serverName)) {
                serverName = this.defaultServerName;
            }
            userName = encodeURIComponent(userName);
            password = encodeURIComponent(password);
            var url = 'mongodb://' + userName + ':' + password + '@' + serverName + '/' + databaseName;
            this.MongoClient.connect(url, function (err, database) {
                if (err == null) {
                    this.db = database;
                    console.log("Connected correctly to server.");
                    deferred.resolve();
                }
                else {
                    deferred.reject(err);
                }
            });
        }
        else {
            deferred.resolve();
        }
        return deferred.promise;
    };
    ;
    JMDbProvider.prototype.close = function () {
        if (JM.isDefined(this.db)) {
            this.db.close();
            this.db = undefined;
        }
    };
    JMDbProvider.prototype.insert = function (collectionName, object) {
        this.db[collectionName].insert(object);
    };
    JMDbProvider.prototype.delete = function (collectionName, deleteCriteria) {
        this.db[collectionName].delete(deleteCriteria);
    };
    JMDbProvider.prototype.find = function (collectionName, limit, findCriteria, sortCriterias) {
        if (JM.isDefined(sortCriterias)) {
            var sortObject = {};
            for (var i = 0; i < sortCriterias.length; i++) {
                sortObject[sortCriterias[i].fieldName] = sortCriterias[i].direction;
            }
            ;
            return this.db[collectionName].find(findCriteria).limit(limit).sort(sortObject);
        }
        else {
            return this.db[collectionName].find(findCriteria).limit(limit);
        }
    };
    ;
    return JMDbProvider;
})();
exports.JMDbProvider = JMDbProvider;
module.exports = new JMDbProvider();
//# sourceMappingURL=app.js.map