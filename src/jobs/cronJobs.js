'use strict';

import cron from 'node-cron';
import TranslationWorkerService from '../services/TranslationWorkerService.js';
import BackupWorkerService from '../services/BackupWorkerService.js';

export const initializeCronJobs = () => {
    console.log('🚀 Initializing CRON jobs...');

    // ═══════════════════════════════════════════════════════════════════════════════
    // TRANSLATION MONITOR - Every 10 minutes
    // ═══════════════════════════════════════════════════════════════════════════════

    cron.schedule('*/10 * * * *', async() => {
        console.log('⏰ Running translation monitor job...');
        const result = await TranslationWorkerService.cronMonitorTranslations();
        if (!result.success) {
            console.error('❌ Translation monitor failed:', result.error);
        }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // DATABASE BACKUP - Daily at 2 AM
    // ═══════════════════════════════════════════════════════════════════════════════

    cron.schedule('0 2 * * *', async() => {
        console.log('⏰ Running database backup job...');
        const result = await BackupWorkerService.cronScheduleBackup();
        if (!result.success) {
            console.error('❌ Database backup failed:', result.error);
        }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // CACHE CLEANUP - Every hour
    // ═══════════════════════════════════════════════════════════════════════════════

    cron.schedule('0 * * * *', async() => {
        console.log('⏰ Running cache cleanup job...');
        // Add cache cleanup logic here
    });

    console.log('✅ CRON jobs initialized');
};