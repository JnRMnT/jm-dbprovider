/// <reference path="../Scripts/typings/index.d.ts" />
import assert from 'assert';
import { SortDirection, JMDbProvider } from '../app.js';

var testDbConfig = {
    serverName: "ozan-kanik.yge95.mongodb.net",
    databaseName: "jmtest",
    userName: "jmtest",
    password: "jmtest"
};

const jmdbProvider = new JMDbProvider();
describe("Main Tests", () => {
    it("DB Connectivity Test", (done) => {
        try {
            jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
                assert.ok(true, "Database connection successful");
                jmdbProvider.close();
                done();
            }, function (e) {
                console.error(e);
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
                jmdbProvider.insert("test", { testProperty: true }).then(function () {
                    jmdbProvider.find("test", undefined, { testProperty: true }).then(function (data) {
                        assert.equal(data.length, 1, "Insert operation failed");
                        jmdbProvider.deleteMany("test", { testProperty: true }).then(function () {
                            jmdbProvider.find("test").then(function (data) {
                                assert.equal(data.length, 0, "Delete operation failed");
                                jmdbProvider.close();
                                done();
                            });
                        }, function (e) {
                            console.error(e);
                            done(new Error("Delete operation rejected"));
                        });
                    }, function (e) {
                        console.error(e);
                        done(new Error("Insert operation rejected"));
                    });
                }, function (error) {
                    console.error(error);
                    done(new Error("Insertion failed: " + error.toString()));
                });
            }, function (error) {
                console.error(error);
                done(new Error("Database connection failed"));
            });
        } catch (ex) {
            console.error(ex.toString());
            done(new Error("Insert-Delete operation failed: " + ex.toString()));
        }
    });

    it("Limit Test", (done) => {
        try {
            jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
                var insertObjects = [];
                for (var i = 0; i < 100; i++) {
                    insertObjects.push({ testProperty: true });
                }
                jmdbProvider.insertMany("test", insertObjects).then(function () {
                    jmdbProvider.find("test").then(function (data) {
                        assert.equal(data.length, 100, "Insert operation failed");
                        jmdbProvider.find("test", 10).then(function (data) {
                            assert.equal(data.length, 10, "Limit operation failed");
                            jmdbProvider.deleteMany("test", undefined).then(function () {
                                jmdbProvider.find("test").then(function (data) {
                                    assert.equal(data.length, 0, "Delete operation failed");
                                    jmdbProvider.close();
                                    done();
                                }, function () {
                                    done(new Error("find after delete operation rejected"));
                                });
                            }, function () {
                                done(new Error("Delete operation rejected"));
                            });
                        }, function () {
                            done(new Error("Limited Find operation rejected"));
                        });
                    }, function () {
                        done(new Error("Find operation rejected"));
                    });
                }, function () {
                    done(new Error("Insert operation rejected"));
                });
            }, function () {
                done(new Error("Database connection failed"));
            });
        } catch (ex) {
            done(new Error("Limit test failed"));
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
                        done(new Error("Cleanup error"));
                    });
                }

                var multipleInsert = [];
                for (var i = 0; i < 100; i++) {
                    multipleInsert.push({ sortId: i });
                }

                jmdbProvider.insertMany("test", multipleInsert).then(function () {
                    jmdbProvider.find("test", undefined, undefined, [{
                        fieldName: "sortId", direction: SortDirection.Descending
                    }]).then(function (descendingSortedData) {
                        assert.equal((descendingSortedData[0] as any).sortId, 99, "Descending Sort test failed");
                        jmdbProvider.find("test", undefined, undefined, [{
                            fieldName: "sortId", direction: SortDirection.Ascending
                        }]).then(function (ascendingSortedData) {
                            assert.equal((ascendingSortedData[0] as any).sortId, 0, "Ascending Sort test failed");
                            jmdbProvider.delete("test", undefined).then(function () {
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