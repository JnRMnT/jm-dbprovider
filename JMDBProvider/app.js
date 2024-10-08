/// <reference path="Scripts/typings/index.d.ts" />
import mongodb from 'mongodb';
import { JM } from "jm-utilities";
export class JMDbProvider {
    constructor() {
        this.MongoClient = mongodb.MongoClient;
        this.defaultServerName = "localhost:27017";
        this.defaultDatabaseName = "test";
    }
    connect(userName, password, databaseName, serverName) {
        var me = this;
        var promise = new Promise((resolve, reject) => {
            if (!JM.isDefined(me.db)) {
                if (JM.isEmpty(databaseName)) {
                    databaseName = me.defaultDatabaseName;
                }
                if (JM.isEmpty(serverName)) {
                    serverName = me.defaultServerName;
                }
                userName = encodeURIComponent(userName);
                password = encodeURIComponent(password);
                var url = 'mongodb+srv://' + userName + ':' + password + '@' + serverName + '/' + databaseName;
                var options = {
                    useUnifiedTopology: true
                };
                me.MongoClient.connect(url, options, function (err, client) {
                    if (err == null) {
                        me.db = client.db(databaseName);
                        console.log("Connected correctly to server.");
                        resolve();
                    }
                    else {
                        reject(err);
                    }
                });
            }
            else {
                resolve();
            }
        });
        return promise;
    }
    ;
    close() {
        if (JM.isDefined(this.db)) {
            this.db = undefined;
        }
    }
    insert(collectionName, object) {
        return this.db.collection(collectionName).insertOne(object);
    }
    insertMany(collectionName, objects) {
        return this.db.collection(collectionName).insertMany(objects);
    }
    deleteMany(collectionName, deleteCriteria) {
        return this.db.collection(collectionName).deleteMany(deleteCriteria);
    }
    delete(collectionName, deleteCriteria) {
        return this.db.collection(collectionName).deleteOne(deleteCriteria);
    }
    find(collectionName, limit, findCriteria, sortCriterias) {
        if (!JM.isDefined(limit)) {
            limit = 0;
        }
        if (!JM.isDefined(findCriteria)) {
            findCriteria = {};
        }
        if (JM.isDefined(sortCriterias)) {
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
    }
    ;
}
export var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
    SortDirection[SortDirection["Descending"] = -1] = "Descending";
})(SortDirection || (SortDirection = {}));
export default new JMDbProvider();
