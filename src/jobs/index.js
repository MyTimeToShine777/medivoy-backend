'use strict';

import { initializeCronJobs } from './cronJobs.js';
import TranslationWorkerService from './translationJob.js';

// ═══════════════════════════════════════════════════════════════════════════════
// JOBS MANAGER - CENTRALIZED EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export class JobsManager {
    constructor() {
        this.jobs = {};
        this.isInitialized = false;
    }

    async initialize() {
        try {
            console.log('🚀 Initializing Jobs Manager...');

            // Initialize CRON jobs
            initializeCronJobs();

            this.jobs = {
                cronJobs: 'initialized',
                translationWorker: 'ready'
            };

            this.isInitialized = true;

            console.log('✅ Jobs Manager initialized successfully');
            console.log('📊 Active jobs:', Object.keys(this.jobs));

            return { success: true, jobs: this.jobs };
        } catch (error) {
            console.error('❌ Jobs Manager initialization error:', error);
            return { success: false, error: error.message };
        }
    }

    async executeJob(jobName, params = {}) {
        try {
            console.log(`⏰ Executing job: ${jobName}`, params);

            switch (jobName) {
                case 'translation-monitor':
                    return await TranslationWorkerService.cronMonitorTranslations();

                case 'translation-batch':
                    return await TranslationWorkerService.processTranslationBatch(
                        params.language,
                        params.batchSize
                    );

                case 'translation-validate':
                    return await TranslationWorkerService.validateTranslations(
                        params.language
                    );

                default:
                    return { success: false, error: `Job ${jobName} not found` };
            }
        } catch (error) {
            console.error(`❌ Job execution error: ${jobName}`, error);
            return { success: false, error: error.message };
        }
    }

    getJobStatus(jobName) {
        if (!this.isInitialized) {
            return { status: 'not_initialized' };
        }

        return {
            jobName: jobName,
            status: this.jobs[jobName] || 'not_found',
            managerStatus: 'running'
        };
    }

    getAllJobs() {
        return {
            isInitialized: this.isInitialized,
            jobs: this.jobs,
            count: Object.keys(this.jobs).length
        };
    }
}

export default new JobsManager();
export { initializeCronJobs, TranslationWorkerService };