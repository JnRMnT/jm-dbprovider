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
    return JMDbProvider;
})();
exports.JMDbProvider = JMDbProvider;
module.exports = new JMDbProvider();
//# sourceMappingURL=app.js.map