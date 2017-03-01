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
}

module.exports = new JMDbProvider();