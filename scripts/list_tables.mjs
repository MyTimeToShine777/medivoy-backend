import { sequelize } from '../src/config/database.js';

(async() => {
    try {
        const [rows] = await sequelize.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
        console.log('TABLES:', rows.map(r => r.table_name).join(', '));
        await sequelize.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        try { await sequelize.close(); } catch (e) {}
        process.exit(1);
    }
})();