/// <reference path="Scripts/typings/index.d.ts" />
import mongodb = require('mongodb');
var JM: JMUtilities = require("jm-utilities");
import q = require("q");
export class JMDbProvider {
    private MongoClient;

    private defaultServerName;
    private defaultDatabaseName;
    private db: mongodb.Db;

    constructor() {
        this.MongoClient = mongodb.MongoClient;
        this.defaultServerName = "localhost:27017";;
        this.defaultDatabaseName = "test";
    }

    public connect(userName: string, password: string, databaseName: string, serverName: string): Q.IPromise<any> {
        var deferred = q.defer();
        var me = this;

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
                    me.db = database;
                    console.log("Connected correctly to server.");
                    deferred.resolve();
                } else {
                    deferred.reject(err);
                }
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };

    public close(): void {
        if (JM.isDefined(this.db)) {
            this.db.close();
            this.db = undefined;
        }
    }

    public insert(collectionName: string, object: any): PromiseLike<any> {
        return this.db.collection(collectionName).insertOne(object);
    }

    public insertMany(collectionName: string, objects: any[]): PromiseLike<any> {
        return this.db.collection(collectionName).insertMany(objects);
    }

    public deleteMany(collectionName: string, deleteCriteria: any): PromiseLike<any> {
        return this.db.collection(collectionName).deleteMany(deleteCriteria);
    }

    public delete(collectionName: string, deleteCriteria: any): PromiseLike<any> {
        return this.db.collection(collectionName).deleteOne(deleteCriteria);
    }

    public find<T>(collectionName: string, limit?: number, findCriteria?: any, sortCriterias?: SortOption[]): PromiseLike<T[]> {
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
            };

            return this.db.collection(collectionName).find(findCriteria).sort(sortObject).limit(limit).toArray();
        } else {
            return this.db.collection(collectionName).find(findCriteria).limit(limit).toArray();
        }
    };
}

export const enum SortDirection {
    Ascending = 1,
    Descending = -1
}

module.exports = new JMDbProvider();