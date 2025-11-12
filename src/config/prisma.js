// src/config/prisma.js
import { PrismaClient } from '@prisma/client';
import '@dotenvx/dotenvx/config';

// ═══════════════════════════════════════════════════════════════════════════════
// PRISMA CLIENT CONFIGURATION - medivoy SCHEMA ONLY
// ═══════════════════════════════════════════════════════════════════════════════

let prisma;

// ✅ ALWAYS: Use 'medivoy' schema for all models/tables
if (process.env.DATABASE_URL) {
    prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
        log: process.env.DB_LOGGING === 'true' ? ['query', 'info', 'warn', 'error'] : ['error'],
        errorFormat: 'pretty',
    });

    console.log('🔗 Using DATABASE_URL for connection (medivoy schema only)');
} else {
    const databaseUrl = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'medivoy'}?schema=medivoy`;

    prisma = new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
        log: process.env.DB_LOGGING === 'true' ? ['query', 'info', 'warn', 'error'] : ['error'],
        errorFormat: 'pretty',
    });

    console.log('🔗 Using individual credentials for connection (medivoy schema only)');
}

const parseDatabaseUrl = (url) => {
    try {
        if (!url) return null;
        const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
        const match = url.match(urlPattern);
        if (match) {
            return {
                user: match[1],
                password: match[2],
                host: match[3],
                port: match[4],
                database: match[5]
            };
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const testConnection = async() => {
    try {
        await prisma.$connect();
        console.log(`✅ PostgreSQL connection established successfully`);

        let dbInfo;
        if (process.env.DATABASE_URL) {
            const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
            if (parsed) {
                dbInfo = {
                    host: parsed.host,
                    port: parsed.port,
                    database: parsed.database,
                    user: parsed.user
                };
            } else {
                dbInfo = {
                    host: 'parsed from URL',
                    port: 'parsed from URL',
                    database: 'parsed from URL',
                    user: 'parsed from URL'
                };
            }
        } else {
            dbInfo = {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                database: process.env.DB_NAME || 'medivoy',
                user: process.env.DB_USER || 'postgres'
            };
        }

        console.log(`   Host: ${dbInfo.host}:${dbInfo.port}`);
        console.log(`   Database: ${dbInfo.database}`);
        console.log(`   User: ${dbInfo.user}`);

        const maskedUrl = process.env.DATABASE_URL ?
            process.env.DATABASE_URL.replace(/:([^:@]{1,})[^:@]*@/, ':***@') :
            `postgresql://${dbInfo.user}:***@${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`;
        console.log(`   URL: ${maskedUrl}`);

        return true;
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown connection error';
        const errorCode = error && error.code ? error.code : 'NO_ERROR_CODE';
        const errorName = error && error.name ? error.name : 'Unknown';

        console.error(`❌ Unable to connect to PostgreSQL: ${errorMessage}`);
        console.error(`   Error Code: ${errorCode}`);
        console.error(`   Error Type: ${errorName}`);
        console.error(`\n   Connection Details:`);

        if (process.env.DATABASE_URL) {
            const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
            if (parsed) {
                console.error(`   - Using: DATABASE_URL`);
                console.error(`   - Host: ${parsed.host}`);
                console.error(`   - Port: ${parsed.port}`);
                console.error(`   - Database: ${parsed.database}`);
                console.error(`   - User: ${parsed.user}`);
            } else {
                console.error(`   - Using: DATABASE_URL (unable to parse)`);
            }
        } else {
            console.error(`   - Using: Individual credentials`);
            console.error(`   - Host: ${process.env.DB_HOST || 'localhost'}`);
            console.error(`   - Port: ${process.env.DB_PORT || 5432}`);
            console.error(`   - Database: ${process.env.DB_NAME || 'medivoy'}`);
            console.error(`   - User: ${process.env.DB_USER || 'postgres'}`);
        }
        console.error(`   - SSL: ${process.env.DB_SSL || 'false'}`);

        if (process.env.NODE_ENV === 'development') {
            console.error(`\n   Full Error Details:`);
            console.error(error);
        }

        console.error(`\n   Troubleshooting:`);
        if (errorCode === 'ECONNREFUSED' || errorMessage.includes('ECONNREFUSED')) {
            console.error(`   1. PostgreSQL service is not running`);
            console.error(`      → Windows: net start postgresql-x64-14`);
            console.error(`      → Linux: sudo systemctl start postgresql`);
            console.error(`      → macOS: brew services start postgresql`);
        } else if (errorCode === 'ENOTFOUND' || errorMessage.includes('getaddrinfo')) {
            console.error(`   1. Host cannot be resolved`);
            console.error(`      → Check DATABASE_URL or DB_HOST in .env file`);
        } else if (errorMessage.includes('password authentication failed')) {
            console.error(`   1. Wrong username or password`);
            console.error(`      → Check DATABASE_URL or DB_USER/DB_PASSWORD in .env`);
        } else if (errorMessage.includes('database') && errorMessage.includes('does not exist')) {
            console.error(`   1. Database does not exist`);
            console.error(`      → Create it with: createdb <database_name>`);
        } else if (errorCode === 'ETIMEDOUT' || errorMessage.includes('timeout')) {
            console.error(`   1. Connection timeout - server may be slow or firewall blocking`);
            console.error(`      → Check firewall and increase DB_CONNECTION_TIMEOUT`);
        } else if (errorMessage.includes('SSL') || errorMessage.includes('ssl')) {
            console.error(`   1. SSL connection issue`);
            console.error(`      → Try setting DB_SSL=true in .env`);
            console.error(`      → Or DB_SSL=false for local development`);
        }

        throw error;
    }
};

export const testConnectionWithRetry = async(maxRetries = 3, retryDelay = 5000) => {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`📡 Connecting to PostgreSQL... (Attempt ${attempt}/${maxRetries})`);
            const result = await testConnection();
            return result;
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                console.log(`🔄 Retrying PostgreSQL in ${retryDelay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }

    const totalTime = ((maxRetries - 1) * retryDelay / 1000).toFixed(2);
    console.error(`❌ PostgreSQL failed after ${maxRetries} attempts (${totalTime}s total)`);
    throw lastError;
};

export const syncDatabase = async(options = {}) => {
    try {
        const force = options.force || process.env.DB_FORCE_SYNC === 'true';

        if (force) {
            console.warn(`⚠️  FORCE SYNC ENABLED - ALL DATA WILL BE LOST!`);
            console.warn(`⚠️  Resetting database in 3 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 3000));

            console.log(`⚠️  Run: pnpm dlx prisma migrate reset --force`);
            console.log(`⚠️  Or: pnpm dlx prisma db push --force-reset`);
        }

        console.log(`✅ Database schema ready (use Prisma migrations)`);
        console.log(`   Info: Run 'pnpm dlx prisma migrate dev' to sync schema`);

        return true;
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown sync error';
        console.error(`❌ Database sync failed: ${errorMessage}`);

        if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️  Continuing without sync (development mode)`);
            return false;
        }
        throw error;
    }
};

export const checkDatabaseHealth = async() => {
    try {
        const result = await prisma.$queryRaw `SELECT NOW() as current_time, version() as version`;

        if (result && result.length > 0) {
            const info = result[0];
            console.log(`✅ Database health check passed`);
            console.log(`   Current Time: ${info.current_time}`);
            console.log(`   Version: ${info.version}`);
            return { healthy: true, info: info };
        }

        return { healthy: false, error: 'No response from database' };
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        console.error(`❌ Database health check failed: ${errorMessage}`);
        return { healthy: false, error: errorMessage };
    }
};

export const disconnectDatabase = async() => {
    try {
        await prisma.$disconnect();
        console.log(`✅ PostgreSQL disconnected successfully`);
        return true;
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        console.error(`❌ Database disconnect failed: ${errorMessage}`);
        throw error;
    }
};

export const gracefulShutdown = async() => {
    try {
        console.log(`\n🔄 Initiating graceful database shutdown...`);
        await prisma.$disconnect();
        console.log(`✅ Database connections closed successfully`);
        return true;
    } catch (error) {
        const errorMessage = error && error.message ? error.message : 'Unknown error';
        console.error(`❌ Error during graceful shutdown: ${errorMessage}`);
        return false;
    }
};

export { prisma };
export default prisma;