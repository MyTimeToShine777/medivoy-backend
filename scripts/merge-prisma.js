import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Support __dirname in ES modules
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const schemaDir = join(__dirname, '..', 'prisma', 'schema');
const schemaFiles = readdirSync(schemaDir).filter(f => f.endsWith('.prisma'));

let merged = '';
for (const f of schemaFiles) {
    merged += readFileSync(join(schemaDir, f), 'utf8') + '\n';
}

// Read the header from prisma/schema.prisma.head if available
const headPath = join(__dirname, '..', 'prisma', 'schema.prisma.head');
let head = '';
if (existsSync(headPath)) {
    head = readFileSync(headPath, 'utf8');
} else {
    head =
        `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;
}

writeFileSync(join(__dirname, '..', 'prisma', 'schema.prisma'), head + '\n' + merged);
console.log('[prisma:merge] prisma/schema.prisma updated!');