/// <reference path="../Scripts/typings/index.d.ts" />
import assert = require('assert');
import { SortDirection } from '../app';
var jmdbProvider: JMDBProvider = require('../app');

var testDbConfig = {
    serverName: "ds135039.mlab.com:35039",
    databaseName: "jmtest",
    userName: "jm-test",
    password: "123456"
};

describe("Main Tests", () => {
    it("DB Connectivity Test", (done) => {
        try {
            jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
                assert.ok(true, "Database connection successful");
                jmdbProvider.close();
                done();
            }, function () {
                done("Database connection failed");
            });
        } catch (ex) {
            jmdbProvider.close();
            assert.ok(false, "Database connection failed");
        }
    });

    it("Insert - Delete Test", (done) => {
        try {
            jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
                return jmdbProvider.insert("test", { testProperty: true }).then(function () {
                    return jmdbProvider.find("test", undefined, { testProperty: true }).then(function (data) {
                        assert.equal(data.length, 1, "Insert operation failed");
                        return jmdbProvider.deleteMany("test", { testProperty: true }).then(function () {
                            return jmdbProvider.find("test").then(function (data) {
                                assert.equal(data.length, 0, "Delete operation failed");
                                jmdbProvider.close();
                                done();
                            });
                        }, function () {
                            done("Delete operation rejected");
                        });
                    }, function () {
                        done("Insert operation rejected");
                    });
                });
            }, function () {
                done("Database connection failed");
            });
        } catch (ex) {
            done("Insert-Delete operation failed");
        }
    });

    it("Limit Test", (done) => {
        try {
            jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
                var insertObjects = [];
                for (var i = 0; i < 100; i++) {
                    insertObjects.push({ testProperty: true });
                }
                return jmdbProvider.insertMany("test", insertObjects).then(function () {
                    return jmdbProvider.find("test").then(function (data) {
                        assert.equal(data.length, 100, "Insert operation failed");
                        return jmdbProvider.find("test", 10).then(function (data) {
                            assert.equal(data.length, 10, "Limit operation failed");
                            return jmdbProvider.deleteMany("test", undefined).then(function () {
                                return jmdbProvider.find("test").then(function (data) {
                                    assert.equal(data.length, 0, "Delete operation failed");
                                    jmdbProvider.close();
                                    done();
                                }, function () {
                                    done("find after delete operation rejected");
                                });
                            }, function () {
                                done("Delete operation rejected");
                            });
                        }, function () {
                            done("Limited Find operation rejected");
                        });
                    }, function () {
                        done("Find operation rejected");
                    });
                }, function () {
                    done("Insert operation rejected");
                });
            }, function () {
                done("Database connection failed");
            });
        } catch (ex) {
            done("Limit test failed");
        }
    });

    it("Sorting Test", (done) => {
        try {
            jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
                let finishTest = function (error?: string) {
                    jmdbProvider.deleteMany("test", undefined).then(function () {
                        jmdbProvider.close();
                        done(error);
                    }, function () {
                        jmdbProvider.close();
                        done("Cleanup error");
                    });
                }

                var multipleInsert = [];
                for (var i = 0; i < 100; i++) {
                    multipleInsert.push({ sortId: i });
                }

                return jmdbProvider.insertMany("test", multipleInsert).then(function () {
                    return jmdbProvider.find("test", undefined, undefined, [{
                        fieldName: "sortId", direction: SortDirection.Descending
                    }]).then(function (descendingSortedData) {
                        assert.equal(descendingSortedData[0].sortId, 99, "Descending Sort test failed");
                        return jmdbProvider.find("test", undefined, undefined, [{
                            fieldName: "sortId", direction: SortDirection.Ascending
                        }]).then(function (ascendingSortedData) {
                            assert.equal(ascendingSortedData[0].sortId, 0, "Ascending Sort test failed");
                            return jmdbProvider.delete("test", undefined).then(function () {
                                finishTest();
                            }, function () {
                                finishTest("Delete all operation failed");
                            });
                        }, function () {
                            finishTest("Find ascending sorted operation failed");
                        });
                    }, function () {
                        finishTest("Find descending sorted operation failed");
                    });
                }, function () {
                    finishTest("Multiple insertion operation failed");
                });
            }, function () {
                done("Database connection failed");
            });
        } catch (ex) {
            assert.ok(false, "Sort test failed");
        }
    });
});