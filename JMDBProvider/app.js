"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="Scripts/typings/index.d.ts" />
var mongodb = require("mongodb");
var jm_utilities_1 = require("jm-utilities");
var q = require("q");
var JMDbProvider = /** @class */ (function () {
    function JMDbProvider() {
        this.MongoClient = mongodb.MongoClient;
        this.defaultServerName = "localhost:27017";
        ;
        this.defaultDatabaseName = "test";
    }
    JMDbProvider.prototype.connect = function (userName, password, databaseName, serverName) {
        var deferred = q.defer();
        var me = this;
        if (!jm_utilities_1.JM.isDefined(this.db)) {
            if (jm_utilities_1.JM.isEmpty(databaseName)) {
                databaseName = this.defaultDatabaseName;
            }
            if (jm_utilities_1.JM.isEmpty(serverName)) {
                serverName = this.defaultServerName;
            }
            userName = encodeURIComponent(userName);
            password = encodeURIComponent(password);
            var url = 'mongodb://' + userName + ':' + password + '@' + serverName + '/' + databaseName;
            this.MongoClient.connect(url, function (err, database) {
                if (err == null) {
                    me.db = database;
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
        if (jm_utilities_1.JM.isDefined(this.db)) {
            this.db = undefined;
        }
    };
    JMDbProvider.prototype.insert = function (collectionName, object) {
        return this.db.collection(collectionName).insertOne(object);
    };
    JMDbProvider.prototype.insertMany = function (collectionName, objects) {
        return this.db.collection(collectionName).insertMany(objects);
    };
    JMDbProvider.prototype.deleteMany = function (collectionName, deleteCriteria) {
        return this.db.collection(collectionName).deleteMany(deleteCriteria);
    };
    JMDbProvider.prototype.delete = function (collectionName, deleteCriteria) {
        return this.db.collection(collectionName).deleteOne(deleteCriteria);
    };
    JMDbProvider.prototype.find = function (collectionName, limit, findCriteria, sortCriterias) {
        if (!jm_utilities_1.JM.isDefined(limit)) {
            limit = 0;
        }
        if (!jm_utilities_1.JM.isDefined(findCriteria)) {
            findCriteria = {};
        }
        if (jm_utilities_1.JM.isDefined(sortCriterias)) {
            var sortObject = {};
            for (var i = 0; i < sortCriterias.length; i++) {
                sortObject[sortCriterias[i].fieldName] = sortCriterias[i].direction;
            }
            ;
            return this.db.collection(collectionName).find(findCriteria).sort(sortObject).limit(limit).toArray();
        }
        else {
            return this.db.collection(collectionName).find(findCriteria).limit(limit).toArray();
        }
    };
    ;
    return JMDbProvider;
}());
exports.JMDbProvider = JMDbProvider;
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
    SortDirection[SortDirection["Descending"] = -1] = "Descending";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
module.exports = new JMDbProvider();
module.exports.SortDirection = SortDirection;
//# sourceMappingURL=app.js.map