/**
 * Terms & Privacy Controller
 * Handles terms and conditions and privacy policy management
 */

const { Op } = require("sequelize");
const {
  TermsConditions,
  PrivacyPolicy,
  UserAcceptance,
  User,
} = require("../models");

/**
 * Get all terms and conditions versions
 */
exports.getAllTerms = async (req, res) => {
  try {
    const { language = "en", isActive, isPublished } = req.query;

    const whereClause = { language };
    if (isActive !== undefined) whereClause.is_active = isActive === "true";
    if (isPublished !== undefined)
      whereClause.is_published = isPublished === "true";

    const terms = await TermsConditions.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "createdBy",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: User,
          as: "publishedBy",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
      order: [["effective_date", "DESC"]],
    });

    res.json({
      success: true,
      data: terms,
    });
  } catch (error) {
    console.error("Error fetching terms:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching terms and conditions",
      error: error.message,
    });
  }
};

/**
 * Get active terms and conditions
 */
exports.getActiveTerms = async (req, res) => {
  try {
    const { language = "en" } = req.query;

    const terms = await TermsConditions.findOne({
      where: {
        language,
        is_active: true,
        is_published: true,
      },
    });

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: "No active terms and conditions found",
      });
    }

    res.json({
      success: true,
      data: terms,
    });
  } catch (error) {
    console.error("Error fetching active terms:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching active terms",
      error: error.message,
    });
  }
};

/**
 * Create terms and conditions
 */
exports.createTerms = async (req, res) => {
  try {
    const {
      version,
      title,
      content,
      language,
      effective_date,
      summary,
      change_log,
      acceptance_required,
      created_by,
    } = req.body;

    const terms = await TermsConditions.create({
      version,
      title,
      content,
      language: language || "en",
      effective_date: effective_date || new Date(),
      summary,
      change_log,
      acceptance_required: acceptance_required !== false,
      is_active: false,
      is_published: false,
      created_by,
    });

    res.status(201).json({
      success: true,
      message: "Terms and conditions created successfully",
      data: terms,
    });
  } catch (error) {
    console.error("Error creating terms:", error);
    res.status(500).json({
      success: false,
      message: "Error creating terms and conditions",
      error: error.message,
    });
  }
};

/**
 * Update terms and conditions
 */
exports.updateTerms = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const terms = await TermsConditions.findByPk(id);
    if (!terms) {
      return res.status(404).json({
        success: false,
        message: "Terms and conditions not found",
      });
    }

    await terms.update(updateData);

    res.json({
      success: true,
      message: "Terms and conditions updated successfully",
      data: terms,
    });
  } catch (error) {
    console.error("Error updating terms:", error);
    res.status(500).json({
      success: false,
      message: "Error updating terms and conditions",
      error: error.message,
    });
  }
};

/**
 * Publish terms and conditions
 */
exports.publishTerms = async (req, res) => {
  try {
    const { id } = req.params;
    const { published_by } = req.body;

    const terms = await TermsConditions.findByPk(id);
    if (!terms) {
      return res.status(404).json({
        success: false,
        message: "Terms and conditions not found",
      });
    }

    // Deactivate other active versions in the same language
    await TermsConditions.update(
      { is_active: false },
      {
        where: {
          language: terms.language,
          is_active: true,
          id: { [Op.ne]: id },
        },
      },
    );

    await terms.update({
      is_published: true,
      is_active: true,
      published_by,
      published_at: new Date(),
    });

    res.json({
      success: true,
      message: "Terms and conditions published successfully",
      data: terms,
    });
  } catch (error) {
    console.error("Error publishing terms:", error);
    res.status(500).json({
      success: false,
      message: "Error publishing terms and conditions",
      error: error.message,
    });
  }
};

/**
 * Get all privacy policy versions
 */
exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const { language = "en", isActive, isPublished } = req.query;

    const whereClause = { language };
    if (isActive !== undefined) whereClause.is_active = isActive === "true";
    if (isPublished !== undefined)
      whereClause.is_published = isPublished === "true";

    const policies = await PrivacyPolicy.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "createdBy",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: User,
          as: "publishedBy",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
      order: [["effective_date", "DESC"]],
    });

    res.json({
      success: true,
      data: policies,
    });
  } catch (error) {
    console.error("Error fetching privacy policies:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching privacy policies",
      error: error.message,
    });
  }
};

/**
 * Get active privacy policy
 */
exports.getActivePrivacyPolicy = async (req, res) => {
  try {
    const { language = "en" } = req.query;

    const policy = await PrivacyPolicy.findOne({
      where: {
        language,
        is_active: true,
        is_published: true,
      },
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "No active privacy policy found",
      });
    }

    res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.error("Error fetching active privacy policy:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching active privacy policy",
      error: error.message,
    });
  }
};

/**
 * Create privacy policy
 */
exports.createPrivacyPolicy = async (req, res) => {
  try {
    const {
      version,
      title,
      content,
      language,
      effective_date,
      summary,
      change_log,
      acceptance_required,
      created_by,
    } = req.body;

    const policy = await PrivacyPolicy.create({
      version,
      title,
      content,
      language: language || "en",
      effective_date: effective_date || new Date(),
      summary,
      change_log,
      acceptance_required: acceptance_required !== false,
      is_active: false,
      is_published: false,
      created_by,
    });

    res.status(201).json({
      success: true,
      message: "Privacy policy created successfully",
      data: policy,
    });
  } catch (error) {
    console.error("Error creating privacy policy:", error);
    res.status(500).json({
      success: false,
      message: "Error creating privacy policy",
      error: error.message,
    });
  }
};

/**
 * Update privacy policy
 */
exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const policy = await PrivacyPolicy.findByPk(id);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy policy not found",
      });
    }

    await policy.update(updateData);

    res.json({
      success: true,
      message: "Privacy policy updated successfully",
      data: policy,
    });
  } catch (error) {
    console.error("Error updating privacy policy:", error);
    res.status(500).json({
      success: false,
      message: "Error updating privacy policy",
      error: error.message,
    });
  }
};

/**
 * Publish privacy policy
 */
exports.publishPrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { published_by } = req.body;

    const policy = await PrivacyPolicy.findByPk(id);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy policy not found",
      });
    }

    // Deactivate other active versions in the same language
    await PrivacyPolicy.update(
      { is_active: false },
      {
        where: {
          language: policy.language,
          is_active: true,
          id: { [Op.ne]: id },
        },
      },
    );

    await policy.update({
      is_published: true,
      is_active: true,
      published_by,
      published_at: new Date(),
    });

    res.json({
      success: true,
      message: "Privacy policy published successfully",
      data: policy,
    });
  } catch (error) {
    console.error("Error publishing privacy policy:", error);
    res.status(500).json({
      success: false,
      message: "Error publishing privacy policy",
      error: error.message,
    });
  }
};

/**
 * Record user acceptance
 */
exports.recordAcceptance = async (req, res) => {
  try {
    const {
      user_id,
      document_type,
      document_id,
      version,
      ip_address,
      user_agent,
    } = req.body;

    const acceptance = await UserAcceptance.create({
      user_id,
      document_type,
      document_id,
      version,
      ip_address,
      user_agent,
      accepted_at: new Date(),
    });

    // Update acceptance count
    if (document_type === "terms_conditions") {
      await TermsConditions.increment("total_acceptances", {
        where: { id: document_id },
      });
    } else if (document_type === "privacy_policy") {
      await PrivacyPolicy.increment("total_acceptances", {
        where: { id: document_id },
      });
    }

    res.status(201).json({
      success: true,
      message: "Acceptance recorded successfully",
      data: acceptance,
    });
  } catch (error) {
    console.error("Error recording acceptance:", error);
    res.status(500).json({
      success: false,
      message: "Error recording acceptance",
      error: error.message,
    });
  }
};

/**
 * Get user acceptances
 */
exports.getUserAcceptances = async (req, res) => {
  try {
    const { userId } = req.params;

    const acceptances = await UserAcceptance.findAll({
      where: { user_id: userId },
      order: [["accepted_at", "DESC"]],
    });

    res.json({
      success: true,
      data: acceptances,
    });
  } catch (error) {
    console.error("Error fetching user acceptances:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user acceptances",
      error: error.message,
    });
  }
};

/**
 * Check if user has accepted latest version
 */
exports.checkUserAcceptance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { documentType, language = "en" } = req.query;

    let latestVersion;
    if (documentType === "terms_conditions") {
      latestVersion = await TermsConditions.findOne({
        where: { language, is_active: true, is_published: true },
        attributes: ["id", "version"],
      });
    } else if (documentType === "privacy_policy") {
      latestVersion = await PrivacyPolicy.findOne({
        where: { language, is_active: true, is_published: true },
        attributes: ["id", "version"],
      });
    }

    if (!latestVersion) {
      return res.json({
        success: true,
        data: {
          hasAccepted: true,
          requiresAcceptance: false,
        },
      });
    }

    const acceptance = await UserAcceptance.findOne({
      where: {
        user_id: userId,
        document_type: documentType,
        version: latestVersion.version,
      },
    });

    res.json({
      success: true,
      data: {
        hasAccepted: !!acceptance,
        requiresAcceptance: !acceptance,
        latestVersion: latestVersion.version,
        documentId: latestVersion.id,
      },
    });
  } catch (error) {
    console.error("Error checking user acceptance:", error);
    res.status(500).json({
      success: false,
      message: "Error checking user acceptance",
      error: error.message,
    });
  }
};
