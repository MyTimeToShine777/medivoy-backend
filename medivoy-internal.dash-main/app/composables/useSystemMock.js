// composables/useSystemMock.js
export const useSystemMock = () => {
  const systemSettings = ref([
    {
      id: 1,
      category: "General",
      key: "system_name",
      name: "System Name",
      value: "MedCare Healthcare Management System",
      type: "text",
      description: "Display name for the healthcare management system",
      required: true,
      validation: "^[a-zA-Z0-9\\s]{3,100}$",
      lastModified: "2025-10-13T10:30:00Z",
      modifiedBy: "System Administrator",
      isSecret: false,
      defaultValue: "Healthcare Management System",
      tags: ["branding", "display"],
      environment: "production",
      options: [],
      canDelete: false,
      hasHistory: true,
      history: [
        {
          value: "Healthcare System",
          modifiedBy: "Admin",
          timestamp: "2025-10-01T09:00:00Z",
        },
        {
          value: "MedCare System",
          modifiedBy: "Admin",
          timestamp: "2025-10-05T14:30:00Z",
        },
      ],
    },
    {
      id: 2,
      category: "General",
      key: "system_version",
      name: "System Version",
      value: "2.4.1",
      type: "text",
      description: "Current version of the healthcare system",
      required: true,
      validation: "^\\d+\\.\\d+\\.\\d+$",
      lastModified: "2025-10-12T16:45:00Z",
      modifiedBy: "DevOps Team",
      isSecret: false,
      defaultValue: "1.0.0",
      tags: ["version", "system"],
      environment: "production",
      options: [],
      canDelete: false,
      hasHistory: true,
      history: [
        {
          value: "2.3.0",
          modifiedBy: "DevOps",
          timestamp: "2025-09-15T12:00:00Z",
        },
        {
          value: "2.4.0",
          modifiedBy: "DevOps",
          timestamp: "2025-10-01T16:00:00Z",
        },
      ],
    },
    {
      id: 3,
      category: "Security",
      key: "session_timeout",
      name: "Session Timeout (minutes)",
      value: "30",
      type: "number",
      description: "Automatic logout time for inactive users",
      required: true,
      validation: "^[1-9]\\d*$",
      lastModified: "2025-10-13T08:15:00Z",
      modifiedBy: "Security Team",
      isSecret: false,
      defaultValue: "30",
      tags: ["security", "timeout"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "60",
          modifiedBy: "Security Team",
          timestamp: "2025-09-20T10:30:00Z",
        },
        {
          value: "45",
          modifiedBy: "Security Team",
          timestamp: "2025-10-01T11:00:00Z",
        },
      ],
    },
    {
      id: 4,
      category: "Security",
      key: "password_min_length",
      name: "Minimum Password Length",
      value: "12",
      type: "number",
      description: "Minimum characters required for user passwords",
      required: true,
      validation: "^[8-9]|[1-9]\\d+$",
      lastModified: "2025-10-13T09:00:00Z",
      modifiedBy: "Security Officer",
      isSecret: false,
      defaultValue: "8",
      tags: ["security", "password"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "8",
          modifiedBy: "Security Officer",
          timestamp: "2025-08-15T14:20:00Z",
        },
        {
          value: "10",
          modifiedBy: "Security Officer",
          timestamp: "2025-09-01T16:45:00Z",
        },
      ],
    },
    {
      id: 5,
      category: "Security",
      key: "max_login_attempts",
      name: "Maximum Login Attempts",
      value: "5",
      type: "number",
      description: "Number of failed attempts before account lockout",
      required: true,
      validation: "^[1-9]\\d*$",
      lastModified: "2025-10-11T14:20:00Z",
      modifiedBy: "Security Team",
      isSecret: false,
      defaultValue: "3",
      tags: ["security", "lockout"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: false,
      history: [],
    },
    {
      id: 6,
      category: "Email",
      key: "smtp_server",
      name: "SMTP Server",
      value: "smtp.healthcenter.ae",
      type: "text",
      description: "Email server for system notifications",
      required: true,
      validation: "^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      lastModified: "2025-10-10T11:30:00Z",
      modifiedBy: "IT Administrator",
      isSecret: false,
      defaultValue: "localhost",
      tags: ["email", "smtp"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "smtp.gmail.com",
          modifiedBy: "IT Admin",
          timestamp: "2025-09-01T10:00:00Z",
        },
      ],
    },
    {
      id: 7,
      category: "Email",
      key: "smtp_password",
      name: "SMTP Password",
      value: "••••••••••••",
      actualValue: "super_secret_password_123",
      type: "password",
      description: "Password for SMTP authentication",
      required: true,
      validation: ".{8,}",
      lastModified: "2025-10-10T11:35:00Z",
      modifiedBy: "IT Administrator",
      isSecret: true,
      defaultValue: "",
      tags: ["email", "authentication", "secret"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: false,
      history: [],
    },
    {
      id: 8,
      category: "Database",
      key: "backup_frequency",
      name: "Backup Frequency",
      value: "daily",
      type: "select",
      options: ["hourly", "daily", "weekly", "monthly"],
      description: "Automatic database backup schedule",
      required: true,
      lastModified: "2025-10-09T22:00:00Z",
      modifiedBy: "Database Administrator",
      isSecret: false,
      defaultValue: "daily",
      tags: ["database", "backup"],
      environment: "production",
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "weekly",
          modifiedBy: "DBA",
          timestamp: "2025-08-01T09:00:00Z",
        },
      ],
    },
    {
      id: 9,
      category: "Database",
      key: "maintenance_window",
      name: "Maintenance Window",
      value: "02:00-04:00",
      type: "text",
      description: "System maintenance time window (24-hour format)",
      required: true,
      validation:
        "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
      lastModified: "2025-10-08T15:45:00Z",
      modifiedBy: "System Administrator",
      isSecret: false,
      defaultValue: "02:00-04:00",
      tags: ["maintenance", "schedule"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "01:00-03:00",
          modifiedBy: "System Admin",
          timestamp: "2025-09-15T12:30:00Z",
        },
      ],
    },
    {
      id: 10,
      category: "Notifications",
      key: "email_notifications",
      name: "Enable Email Notifications",
      value: "true",
      type: "boolean",
      description: "Send email notifications for system events",
      required: false,
      lastModified: "2025-10-13T12:00:00Z",
      modifiedBy: "Notification Manager",
      isSecret: false,
      defaultValue: "true",
      tags: ["notifications", "email"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "false",
          modifiedBy: "Admin",
          timestamp: "2025-09-01T08:00:00Z",
        },
      ],
    },
    {
      id: 11,
      category: "API",
      key: "api_rate_limit",
      name: "API Rate Limit",
      value: "1000",
      type: "number",
      description: "Maximum API requests per hour per user",
      required: true,
      validation: "^[1-9]\\d*$",
      lastModified: "2025-10-07T14:30:00Z",
      modifiedBy: "API Team",
      isSecret: false,
      defaultValue: "500",
      tags: ["api", "rate_limit"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "500",
          modifiedBy: "API Team",
          timestamp: "2025-09-01T10:00:00Z",
        },
        {
          value: "750",
          modifiedBy: "API Team",
          timestamp: "2025-09-15T14:30:00Z",
        },
      ],
    },
    {
      id: 12,
      category: "Logging",
      key: "log_retention_days",
      name: "Log Retention Period (days)",
      value: "90",
      type: "number",
      description: "Number of days to retain system logs",
      required: true,
      validation: "^[1-9]\\d*$",
      lastModified: "2025-10-06T09:15:00Z",
      modifiedBy: "Operations Team",
      isSecret: false,
      defaultValue: "30",
      tags: ["logging", "retention"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "30",
          modifiedBy: "Ops Team",
          timestamp: "2025-08-01T09:00:00Z",
        },
        {
          value: "60",
          modifiedBy: "Ops Team",
          timestamp: "2025-09-01T10:30:00Z",
        },
      ],
    },
    {
      id: 13,
      category: "Performance",
      key: "cache_timeout",
      name: "Cache Timeout (seconds)",
      value: "3600",
      type: "number",
      description: "Time in seconds before cache expires",
      required: true,
      validation: "^[1-9]\\d*$",
      lastModified: "2025-10-05T11:20:00Z",
      modifiedBy: "Performance Team",
      isSecret: false,
      defaultValue: "1800",
      tags: ["performance", "cache"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "1800",
          modifiedBy: "Perf Team",
          timestamp: "2025-09-01T12:00:00Z",
        },
      ],
    },
    {
      id: 14,
      category: "Integration",
      key: "webhook_timeout",
      name: "Webhook Timeout (seconds)",
      value: "30",
      type: "number",
      description: "Timeout for outgoing webhook requests",
      required: true,
      validation: "^[1-9]\\d*$",
      lastModified: "2025-10-04T16:30:00Z",
      modifiedBy: "Integration Team",
      isSecret: false,
      defaultValue: "15",
      tags: ["integration", "webhook", "timeout"],
      environment: "production",
      options: [],
      canDelete: true,
      hasHistory: false,
      history: [],
    },
    {
      id: 15,
      category: "Theme",
      key: "default_theme",
      name: "Default Theme",
      value: "light",
      type: "select",
      options: ["light", "dark", "auto"],
      description: "Default theme for new users",
      required: true,
      lastModified: "2025-10-03T10:15:00Z",
      modifiedBy: "UI Team",
      isSecret: false,
      defaultValue: "light",
      tags: ["ui", "theme", "appearance"],
      environment: "production",
      canDelete: true,
      hasHistory: true,
      history: [
        {
          value: "auto",
          modifiedBy: "UI Team",
          timestamp: "2025-09-15T14:00:00Z",
        },
      ],
    },
  ]);

  const systemStats = computed(() => ({
    totalSettings: systemSettings.value.length,
    categoryCounts: systemSettings.value.reduce((acc, setting) => {
      acc[setting.category] = (acc[setting.category] || 0) + 1;
      return acc;
    }, {}),
    secretSettings: systemSettings.value.filter((s) => s.isSecret).length,
    recentlyModified: systemSettings.value.filter((s) => {
      const modifiedDate = new Date(s.lastModified);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return modifiedDate > dayAgo;
    }).length,
    environmentCounts: systemSettings.value.reduce((acc, setting) => {
      acc[setting.environment] = (acc[setting.environment] || 0) + 1;
      return acc;
    }, {}),
    requiredSettings: systemSettings.value.filter((s) => s.required).length,
    settingsWithHistory: systemSettings.value.filter(
      (s) => s.hasHistory && s.history.length > 0
    ).length,
    typeCounts: systemSettings.value.reduce((acc, setting) => {
      acc[setting.type] = (acc[setting.type] || 0) + 1;
      return acc;
    }, {}),
  }));

  const addSetting = (settingData) => {
    const newSetting = {
      ...settingData,
      id: Math.max(...systemSettings.value.map((s) => s.id)) + 1,
      lastModified: new Date().toISOString(),
      modifiedBy: "Current User",
      hasHistory: false,
      history: [],
      canDelete: true,
      options: settingData.options || [],
    };
    systemSettings.value.unshift(newSetting);
    console.log("Added new setting:", newSetting.key);
  };

  const updateSetting = (id, settingData) => {
    const index = systemSettings.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      const oldSetting = { ...systemSettings.value[index] };

      // Add to history if value changed
      if (
        oldSetting.value !== settingData.value &&
        settingData.value !== undefined
      ) {
        if (!oldSetting.history) oldSetting.history = [];
        oldSetting.history.unshift({
          value: oldSetting.value,
          modifiedBy: oldSetting.modifiedBy,
          timestamp: oldSetting.lastModified,
        });
        oldSetting.hasHistory = true;
      }

      systemSettings.value[index] = {
        ...oldSetting,
        ...settingData,
        lastModified: new Date().toISOString(),
        modifiedBy: "Current User",
        history: oldSetting.history,
      };
      console.log("Updated setting:", systemSettings.value[index].key);
    }
  };

  const deleteSetting = (id) => {
    const index = systemSettings.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      const setting = systemSettings.value[index];
      if (setting.canDelete) {
        systemSettings.value.splice(index, 1);
        console.log("Deleted setting:", setting.key);
      } else {
        throw new Error(
          "This setting cannot be deleted as it is required for system operation"
        );
      }
    }
  };

  const resetToDefault = (id) => {
    const setting = systemSettings.value.find((s) => s.id === id);
    if (
      setting &&
      setting.defaultValue !== undefined &&
      setting.defaultValue !== ""
    ) {
      updateSetting(id, { value: setting.defaultValue });
      console.log("Reset setting to default:", setting.key);
    } else {
      throw new Error("No default value available for this setting");
    }
  };

  const bulkDelete = (ids) => {
    let deletedCount = 0;
    const errors = [];

    ids.forEach((id) => {
      try {
        deleteSetting(id);
        deletedCount++;
      } catch (error) {
        const setting = systemSettings.value.find((s) => s.id === id);
        errors.push(`${setting?.name || "Unknown"}: ${error.message}`);
      }
    });

    console.log(
      `Bulk delete completed: ${deletedCount} deleted, ${errors.length} errors`
    );
    return { deletedCount, errors };
  };

  const bulkUpdate = (ids, updateData) => {
    let updatedCount = 0;

    ids.forEach((id) => {
      try {
        updateSetting(id, updateData);
        updatedCount++;
      } catch (error) {
        console.error("Error updating setting:", error);
      }
    });

    console.log(`Bulk update completed: ${updatedCount} settings updated`);
    return updatedCount;
  };

  const validateSetting = (setting) => {
    const errors = [];

    // Required field validation
    if (!setting.name || setting.name.trim() === "") {
      errors.push("Setting name is required");
    }

    if (!setting.key || setting.key.trim() === "") {
      errors.push("Setting key is required");
    }

    // Key uniqueness validation
    const existingKey = systemSettings.value.find(
      (s) => s.key === setting.key && s.id !== setting.id
    );
    if (existingKey) {
      errors.push("Setting key must be unique");
    }

    // Type-specific validation
    if (
      setting.type === "number" &&
      setting.value &&
      isNaN(Number(setting.value))
    ) {
      errors.push("Value must be a valid number");
    }

    if (
      setting.type === "boolean" &&
      setting.value &&
      !["true", "false"].includes(setting.value)
    ) {
      errors.push('Boolean value must be "true" or "false"');
    }

    if (setting.type === "email" && setting.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(setting.value)) {
        errors.push("Value must be a valid email address");
      }
    }

    if (setting.type === "url" && setting.value) {
      try {
        new URL(setting.value);
      } catch {
        errors.push("Value must be a valid URL");
      }
    }

    // Regex validation
    if (setting.validation && setting.value) {
      try {
        const regex = new RegExp(setting.validation);
        if (!regex.test(setting.value)) {
          errors.push("Value does not match the required pattern");
        }
      } catch {
        errors.push("Invalid validation pattern");
      }
    }

    // Select validation
    if (setting.type === "select" && setting.value) {
      if (!setting.options || !setting.options.includes(setting.value)) {
        errors.push("Value must be one of the available options");
      }
    }

    return errors;
  };

  const exportSettings = (format = "json") => {
    const settingsData = systemSettings.value.map((s) => ({
      key: s.key,
      name: s.name,
      value: s.isSecret ? "[REDACTED]" : s.value,
      category: s.category,
      type: s.type,
      required: s.required,
      environment: s.environment,
      description: s.description,
      tags: s.tags,
      lastModified: s.lastModified,
      modifiedBy: s.modifiedBy,
    }));

    let content, filename, mimeType;

    if (format === "csv") {
      const headers = [
        "Key",
        "Name",
        "Value",
        "Category",
        "Type",
        "Required",
        "Environment",
        "Description",
        "Last Modified",
      ];
      const rows = settingsData.map((s) => [
        s.key,
        s.name,
        s.value,
        s.category,
        s.type,
        s.required,
        s.environment,
        s.description,
        s.lastModified,
      ]);

      content = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");
      filename = `system-settings-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      mimeType = "text/csv";
    } else {
      content = JSON.stringify(settingsData, null, 2);
      filename = `system-settings-${
        new Date().toISOString().split("T")[0]
      }.json`;
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    console.log(
      `Exported ${settingsData.length} settings as ${format.toUpperCase()}`
    );
  };

  const importSettings = (data, options = {}) => {
    const { overwrite = false, validateOnly = false } = options;
    const results = {
      imported: 0,
      updated: 0,
      errors: [],
      warnings: [],
    };

    try {
      const settings = Array.isArray(data) ? data : JSON.parse(data);

      settings.forEach((settingData, index) => {
        try {
          const validation = validateSetting(settingData);
          if (validation.length > 0) {
            results.errors.push(`Row ${index + 1}: ${validation.join(", ")}`);
            return;
          }

          const existingSetting = systemSettings.value.find(
            (s) => s.key === settingData.key
          );

          if (existingSetting) {
            if (overwrite && !validateOnly) {
              updateSetting(existingSetting.id, settingData);
              results.updated++;
            } else if (!overwrite) {
              results.warnings.push(
                `Row ${index + 1}: Setting "${settingData.key}" already exists`
              );
            }
          } else {
            if (!validateOnly) {
              addSetting(settingData);
              results.imported++;
            }
          }
        } catch (error) {
          results.errors.push(`Row ${index + 1}: ${error.message}`);
        }
      });
    } catch (error) {
      results.errors.push(`Import failed: ${error.message}`);
    }

    return results;
  };

  const searchSettings = (query) => {
    if (!query || query.trim() === "") return systemSettings.value;

    const searchTerm = query.toLowerCase().trim();
    return systemSettings.value.filter(
      (setting) =>
        setting.name.toLowerCase().includes(searchTerm) ||
        setting.key.toLowerCase().includes(searchTerm) ||
        setting.description.toLowerCase().includes(searchTerm) ||
        setting.category.toLowerCase().includes(searchTerm) ||
        (setting.tags &&
          setting.tags.some((tag) => tag.toLowerCase().includes(searchTerm))) ||
        setting.modifiedBy.toLowerCase().includes(searchTerm)
    );
  };

  const getSettingsByCategory = (category) => {
    return systemSettings.value.filter((s) => s.category === category);
  };

  const getRecentChanges = (days = 7) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return systemSettings.value
      .filter((s) => new Date(s.lastModified) > cutoffDate)
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  };

  const backupSettings = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      settings: systemSettings.value.map((s) => ({ ...s })),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-settings-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log("Settings backup created");
  };

  const restoreSettings = (backupData) => {
    try {
      const backup = JSON.parse(backupData);
      if (!backup.settings || !Array.isArray(backup.settings)) {
        throw new Error("Invalid backup format");
      }

      systemSettings.value = backup.settings;
      console.log(`Restored ${backup.settings.length} settings from backup`);
      return true;
    } catch (error) {
      console.error("Restore failed:", error);
      throw error;
    }
  };

  return {
    systemSettings,
    systemStats,
    addSetting,
    updateSetting,
    deleteSetting,
    resetToDefault,
    bulkDelete,
    bulkUpdate,
    validateSetting,
    exportSettings,
    importSettings,
    searchSettings,
    getSettingsByCategory,
    getRecentChanges,
    backupSettings,
    restoreSettings,
  };
};
