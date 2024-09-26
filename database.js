const { Pool } = require('pg');

function extractPostgresInfo(jdbcUrl) {
    const regex = /^jdbc:postgresql:\/\/([^:]+):(\d+)\/(.+)$/;
    const match = jdbcUrl.match(regex);

    if (match && match.length === 4) {
        const [, host, port, database] = match;
        return { host, port, database };
    } else {
        throw new Error('Invalid JDBC URL');
    }
}

async function dropAndCreateReferenceDatabase(config) {
    const { referenceUrl, referenceUsername, referencePassword } = config.database;
    const { host, port, database: referenceDatabase } = extractPostgresInfo(referenceUrl);

    const pool = new Pool({
        user: referenceUsername,
        password: referencePassword,
        host: host,
        port: port
    });

    const client = await pool.connect();

    try {
        await client.query(`DROP DATABASE IF EXISTS ${referenceDatabase};`);
        await client.query(`CREATE DATABASE ${referenceDatabase};`);

        console.log('Reference database dropped and recreated successfully.');
    } finally {
        client.release();
    }

    await pool.end();
}

module.exports = {
    dropAndCreateReferenceDatabase
};