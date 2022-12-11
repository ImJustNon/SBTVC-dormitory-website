module.exports = {
    database: {
        postgreSQL: {
            user: 'postgres',
            host: '127.0.0.1',
            database: 'sbtvc_dormitory_system_test_database',
            password: 'Non_912108',
            port: 5432,
            // connectionString: string, 
            // ssl: any, 
            // types: any, 
            // statement_timeout: number, 
            // query_timeout: number, 
            application_name: "sbtvc_dormitory_system", 
            // connectionTimeoutMillis: number,
            // idle_in_transaction_session_timeout: number
        },
        mongoDB: {
            URI: "mongodb+srv://Kwan-0111:LIVPbGPbI6fVLM9E@cluster0.rp8ie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        },
    },
    app: {
        port: 8000,
        auto_open: false,
    },
}