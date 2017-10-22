declare class JMDBProvider {
    private defaultServerName;
    private defaultDatabaseName;
    private db;
    public connect(userName: string, password: string, databaseName: string, serverName: string): Q.IPromise<any>;
    public close(): void;
    public insert(collectionName: string, object: any): Q.IPromise<any>;
    public insertMany(collectionName: string, objects: any[]): Q.IPromise<any>;
    public delete(collectionName: string, deleteCriteria: any): Q.IPromise<any>;
    public deleteMany(collectionName: string, deleteCriteria: any): Q.IPromise<any>;
    public find(collectionName: string, limit?: number, findCriteria?: any, sortCriterias?: SortOption[]): Q.IPromise<any[]>;
    public find<T>(collectionName: string, limit?: number, findCriteria?: any, sortCriterias?: SortOption[]): Q.IPromise<T[]>;
    public getModelFromSchema<T extends mongoose.Document>(modelName: string, schema: mongoose.Schema, collection?: string, skipInit?: boolean): mongoose.Model<mongoose.Document>;
}

declare class SortOption {
    public fieldName: string;
    public direction: SortDirection; 
}

declare enum SortDirection {
    Ascending = 1,
    Descending = -1
}