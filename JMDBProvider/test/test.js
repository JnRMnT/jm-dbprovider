"use strict";
/// <reference path="../Scripts/typings/index.d.ts" />
var assert = require('assert');
var jmdbProvider = require('../app');
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
    SortDirection[SortDirection["Descending"] = -1] = "Descending";
})(SortDirection || (SortDirection = {}));
var testDbConfig = {
    serverName: "ds135039.mlab.com:35039",
    databaseName: "jmtest",
    userName: "jm-test",
    password: "123456"
};
describe("Main Tests", function () {
    it("DB Connectivity Test", function () {
        try {
            return jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
                assert.ok(true, "Database connection successful");
                jmdbProvider.close();
            }, function () {
                assert.ok(false, "Database connection failed");
            });
        }
        catch (ex) {
            jmdbProvider.close();
            assert.ok(false, "Database connection failed");
        }
    });
    it("Insert - Delete Test", function () {
        try {
            return jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
                return jmdbProvider.insert("test", { testProperty: true }).then(function () {
                    return jmdbProvider.find("test", undefined, { testProperty: true }).then(function (data) {
                        assert.equal(data.length, 1, "Insert operation failed");
                        return jmdbProvider.deleteMany("test", { testProperty: true }).then(function () {
                            return jmdbProvider.find("test").then(function (data) {
                                assert.equal(data.length, 0, "Delete operation failed");
                                jmdbProvider.close();
                            });
                        }, function () {
                            assert.ok(false, "Delete operation rejected");
                        });
                    }, function () {
                        assert.ok(false, "Insert operation rejected");
                    });
                });
            }, function () {
                assert.ok(false, "Database connection failed");
            });
        }
        catch (ex) {
            assert.ok(false, "Insert-Delete operation failed");
        }
    });
    it("Limit Test", function () {
        try {
            return jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
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
                                }, function () {
                                    assert.ok(false, "find after delete operation rejected");
                                });
                            }, function () {
                                assert.ok(false, "Delete operation rejected");
                            });
                        }, function () {
                            assert.ok(false, "Limited Find operation rejected");
                        });
                    }, function () {
                        assert.ok(false, "Find operation rejected");
                    });
                }, function () {
                    assert.ok(false, "Insert operation rejected");
                });
            }, function () {
                assert.ok(false, "Database connection failed");
            });
        }
        catch (ex) {
            assert.ok(false, "Limit test failed");
        }
    });
    it("Sorting Test", function () {
        try {
            return jmdbProvider.connect(testDbConfig.userName, testDbConfig.password, testDbConfig.databaseName, testDbConfig.serverName).then(function () {
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
                                jmdbProvider.close();
                            }, function () {
                                assert.ok(false, "Delete all operation failed");
                            });
                        }, function () {
                            assert.ok(false, "Find ascending sorted operation failed");
                        });
                    }, function () {
                        assert.ok(false, "Find descending sorted operation failed");
                    });
                }, function () {
                    assert.ok(false, "Multiple insertion operation failed");
                });
            }, function () {
                assert.ok(false, "Database connection failed");
            });
        }
        catch (ex) {
            assert.ok(false, "Sort test failed");
        }
    });
});
//# sourceMappingURL=test.js.map