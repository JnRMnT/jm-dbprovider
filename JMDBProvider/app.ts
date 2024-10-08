/// <reference path="Scripts/typings/index.d.ts" />
import mongodb from 'mongodb';
import { JM } from "jm-utilities";
export class JMDbProvider {
    private MongoClient;

    private defaultServerName;
    private defaultDatabaseName;
    private db: mongodb.Db;

    constructor() {
        this.MongoClient = mongodb.MongoClient;
        this.defaultServerName = "localhost:27017";
        this.defaultDatabaseName = "test";
    }

    public connect(userName: string, password: string, databaseName: string, serverName: string): Promise<void> {
        var me = this;
        var promise = new Promise<void>((resolve, reject) => {
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
                var options: mongodb.MongoClientOptions = {
                    useUnifiedTopology: true
                };
                me.MongoClient.connect(url, options, function (err, client) {
                    if (err == null) {
                        me.db = client.db(databaseName);
                        console.log("Connected correctly to server.");
                        resolve();
                    } else {
                        reject(err);
                    }
                });
            } else {
                resolve();
            }
        });
        return promise;
    };

    public close(): void {
        if (JM.isDefined(this.db)) {
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

export enum SortDirection {
    Ascending = 1,
    Descending = -1
}

export default new JMDbProvider();