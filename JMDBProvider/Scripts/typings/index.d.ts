/// <reference path="globals/mocha/index.d.ts" />
/// <reference path="modules/q/index.d.ts" />
/// <reference path="mongodb/index.d.ts" />
/// <reference path="../../node_modules/jm-utilities/Scripts/typings/jm.utilities.d.ts" />

declare class JMDBProvider {
    private defaultServerName;
    private defaultDatabaseName;
    private db;
    public connect(userName: string, password: string, databaseName: string, serverName: string): Q.IPromise<any>;
    public close(): void;
}