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
    public insert(collectionName: string, object: any);
    public delete(collectionName: string, deleteCriteria: any);
    public find(collectionName: string, limit?: number, findCriteria?: any, sortCriterias?: SortOption[]): any[] 
}

declare class SortOption {
    public fieldName: string;
    public direction: SortDirection;
}

declare enum SortDirection {
    Ascending = -1,
    Descending = 1
}