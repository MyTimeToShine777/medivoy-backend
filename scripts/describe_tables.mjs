import { sequelize } from '../src/config/database.js';

(async() => {
    try {
        const qi = sequelize.getQueryInterface();
        const bookings = await qi.describeTable('bookings');
        const bp = await qi.describeTable('booking_preferences');
        console.log('BOOKINGS:', JSON.stringify(bookings, null, 2));
        console.log('BOOKING_PREFERENCES:', JSON.stringify(bp, null, 2));

        const [fkRows] = await sequelize.query(
            `SELECT tc.constraint_name, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
       FROM information_schema.table_constraints AS tc
       JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
       JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
       WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('booking_preferences','bookings');`
        );

        console.log('FKS:', JSON.stringify(fkRows, null, 2));
        await sequelize.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        try { await sequelize.close(); } catch (e) {}
        process.exit(1);
    }
})();