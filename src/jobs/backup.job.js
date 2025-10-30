const { backupQueue } = require("./queue");
const { exec } = require("child_process");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs").promises;
const logger = require("../utils/logger");
const config = require("../config");

const execAsync = promisify(exec);

// Process backup jobs
backupQueue.process(async (job) => {
  const { type, data } = job.data;

  try {
    logger.info("Processing backup job", { type, jobId: job.id });

    switch (type) {
      case "database":
        await backupDatabase(data);
        break;

      case "files":
        await backupFiles(data);
        break;

      case "full":
        await fullBackup(data);
        break;

      default:
        throw new Error(`Unknown backup type: ${type}`);
    }

    logger.info("Backup job completed successfully", { type, jobId: job.id });
    return { success: true, type };
  } catch (error) {
    logger.error("Backup job failed", {
      type,
      jobId: job.id,
      error: error.message,
    });
    throw error;
  }
});

// Backup PostgreSQL database
const backupDatabase = async (data) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(__dirname, "../../backups/database");
  const backupFile = path.join(backupDir, `medivoy_db_${timestamp}.sql`);

  try {
    // Create backup directory if it doesn't exist
    await fs.mkdir(backupDir, { recursive: true });

    // Create database backup using pg_dump
    const command = `pg_dump -h ${config.database.host} -U ${config.database.username} -d ${config.database.database} -F c -f ${backupFile}`;

    await execAsync(command, {
      env: { ...process.env, PGPASSWORD: config.database.password },
    });

    logger.info("Database backup created", { backupFile });

    // Optional: Upload to cloud storage (S3, etc.)
    // await uploadToCloudStorage(backupFile);

    // Optional: Delete old backups (keep last 7 days)
    await cleanupOldBackups(backupDir, 7);

    return { success: true, backupFile };
  } catch (error) {
    logger.error("Database backup failed", { error: error.message });
    throw error;
  }
};

// Backup uploaded files
const backupFiles = async (data) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(__dirname, "../../backups/files");
  const backupFile = path.join(backupDir, `medivoy_files_${timestamp}.tar.gz`);
  const uploadsDir = path.join(__dirname, "../../uploads");

  try {
    // Create backup directory if it doesn't exist
    await fs.mkdir(backupDir, { recursive: true });

    // Create compressed archive of uploads directory
    const command = `tar -czf ${backupFile} -C ${uploadsDir} .`;
    await execAsync(command);

    logger.info("Files backup created", { backupFile });

    // Optional: Upload to cloud storage
    // await uploadToCloudStorage(backupFile);

    // Optional: Delete old backups
    await cleanupOldBackups(backupDir, 7);

    return { success: true, backupFile };
  } catch (error) {
    logger.error("Files backup failed", { error: error.message });
    throw error;
  }
};

// Full system backup (database + files)
const fullBackup = async (data) => {
  const results = {
    database: null,
    files: null,
  };

  try {
    results.database = await backupDatabase(data);
    results.files = await backupFiles(data);

    logger.info("Full backup completed", results);
    return results;
  } catch (error) {
    logger.error("Full backup failed", { error: error.message });
    throw error;
  }
};

// Cleanup old backup files
const cleanupOldBackups = async (backupDir, daysToKeep) => {
  try {
    const files = await fs.readdir(backupDir);
    const now = Date.now();
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    for (const file of files) {
      const filePath = path.join(backupDir, file);
      const stats = await fs.stat(filePath);
      const age = now - stats.mtime.getTime();

      if (age > maxAge) {
        await fs.unlink(filePath);
        logger.info("Deleted old backup file", { file });
      }
    }
  } catch (error) {
    logger.error("Failed to cleanup old backups", { error: error.message });
  }
};

// Schedule daily backups
const scheduleDailyBackup = () => {
  // Run backup every day at 2 AM
  backupQueue.add(
    { type: "full", data: {} },
    {
      repeat: {
        cron: "0 2 * * *", // 2 AM every day
      },
    },
  );

  logger.info("Daily backup scheduled");
};

// Add backup job to queue
const addBackupJob = async (type, data = {}, options = {}) => {
  try {
    const job = await backupQueue.add(
      { type, data },
      {
        priority: options.priority || 1,
        ...options,
      },
    );

    logger.info("Backup job added to queue", { type, jobId: job.id });
    return job;
  } catch (error) {
    logger.error("Failed to add backup job to queue", {
      type,
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  addBackupJob,
  scheduleDailyBackup,
};
