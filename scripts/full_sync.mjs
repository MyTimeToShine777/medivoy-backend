import { initializeModels } from '../src/models/index.js';
import { syncDatabase } from '../src/config/database.js';

(async() => {
    try {
        initializeModels();
        console.log('Calling syncDatabase(true) ...');
        const ok = await syncDatabase(true);
        console.log('SYNC DONE', ok);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();