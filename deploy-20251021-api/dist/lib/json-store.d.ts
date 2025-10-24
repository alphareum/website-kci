export declare function readTable<T>(tableName: string, fallback?: T[]): Promise<T[]>;
export declare function writeTable<T>(tableName: string, rows: T[]): Promise<void>;
export declare function nextId(records: Array<{
    id: number;
}>): number;
