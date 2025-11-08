import { initializeModels, getModels } from '../src/models/index.js';

(async() => {
    try {
        const models = initializeModels();
        console.log('Model keys:', Object.keys(models).slice(0, 50));
        if (models.Booking) {
            console.log('Booking exists. tableName=', models.Booking.options.tableName || models.Booking.tableName);
            console.log('Booking primary keys:', Object.keys(models.Booking.rawAttributes).filter(a => models.Booking.rawAttributes[a].primaryKey));
        } else {
            console.log('Booking model not found');
        }
        await (models.sequelize ? models.sequelize.close() : Promise.resolve());
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();