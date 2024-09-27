const mssql = require('mssql');

const config = {
    user: 'test',
    password: '12345',
    server: 'ANDREYPC',
    database: 'testdb',
    port: 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};

// Create a connection pool
const poolPromise = new mssql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed: ', err);
        process.exit(1);
    });

module.exports = poolPromise;
