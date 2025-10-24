export declare const env: {
    nodeEnv: "development" | "test" | "production";
    server: {
        host: string;
        port: number;
    };
    publicBaseUrl: string;
    supabase: {
        url: string;
        serviceRoleKey: string;
        storageBucket: string;
    } | null;
    legacy: {
        mysqlDsn: string | undefined;
    };
    storage: {
        dataDir: string;
    };
};
