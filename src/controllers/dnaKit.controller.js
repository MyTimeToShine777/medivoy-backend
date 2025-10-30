/**
 * DNA Kit Controller
 * Handles DNA kit orders and genetic testing services
 */

const { Op } = require("sequelize");
const { DNAKit, Patient, Laboratory, User } = require("../models");

/**
 * Get all DNA kit orders
 */
exports.getAllDNAKits = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      kitType,
      orderStatus,
      paymentStatus,
      patientId,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { order_number: { [Op.iLike]: `%${search}%` } },
        { barcode: { [Op.iLike]: `%${search}%` } },
        { kit_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (kitType) whereClause.kit_type = kitType;
    if (orderStatus) whereClause.order_status = orderStatus;
    if (paymentStatus) whereClause.payment_status = paymentStatus;
    if (patientId) whereClause.patient_id = patientId;

    const { count, rows } = await DNAKit.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: "patient",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["first_name", "last_name", "email"],
            },
          ],
        },
        {
          model: Laboratory,
          as: "laboratory",
          attributes: ["id", "name", "city", "country"],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [[sortBy, sortOrder]],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching DNA kits:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching DNA kit orders",
      error: error.message,
    });
  }
};

/**
 * Get DNA kit by ID
 */
exports.getDNAKitById = async (req, res) => {
  try {
    const { id } = req.params;

    const dnaKit = await DNAKit.findByPk(id, {
      include: [
        {
          model: Patient,
          as: "patient",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["first_name", "last_name", "email", "phone"],
            },
          ],
        },
        {
          model: Laboratory,
          as: "laboratory",
        },
      ],
    });

    if (!dnaKit) {
      return res.status(404).json({
        success: false,
        message: "DNA kit order not found",
      });
    }

    res.json({
      success: true,
      data: dnaKit,
    });
  } catch (error) {
    console.error("Error fetching DNA kit:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching DNA kit order",
      error: error.message,
    });
  }
};

/**
 * Create DNA kit order
 */
exports.createDNAKitOrder = async (req, res) => {
  try {
    const {
      patient_id,
      kit_type,
      kit_name,
      kit_description,
      laboratory_id,
      lab_partner_name,
      amount,
      currency,
      shipping_address,
      sample_collection_method,
      consent_given,
      privacy_settings,
    } = req.body;

    // Validate patient exists
    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Generate order number
    const orderNumber = `DNA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const dnaKit = await DNAKit.create({
      order_number: orderNumber,
      patient_id,
      kit_type: kit_type || "health",
      kit_name,
      kit_description,
      laboratory_id,
      lab_partner_name,
      amount: amount || 0,
      currency: currency || "USD",
      order_status: "ordered",
      payment_status: "pending",
      ordered_at: new Date(),
      shipping_address,
      sample_collection_method: sample_collection_method || "saliva",
      consent_given: consent_given || false,
      consent_date: consent_given ? new Date() : null,
      privacy_settings,
    });

    const dnaKitWithDetails = await DNAKit.findByPk(dnaKit.id, {
      include: [
        {
          model: Patient,
          as: "patient",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["first_name", "last_name", "email"],
            },
          ],
        },
        {
          model: Laboratory,
          as: "laboratory",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "DNA kit order created successfully",
      data: dnaKitWithDetails,
    });
  } catch (error) {
    console.error("Error creating DNA kit order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating DNA kit order",
      error: error.message,
    });
  }
};

/**
 * Update DNA kit order
 */
exports.updateDNAKitOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const dnaKit = await DNAKit.findByPk(id);
    if (!dnaKit) {
      return res.status(404).json({
        success: false,
        message: "DNA kit order not found",
      });
    }

    await dnaKit.update(updateData);

    const updatedDNAKit = await DNAKit.findByPk(id, {
      include: [
        {
          model: Patient,
          as: "patient",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["first_name", "last_name", "email"],
            },
          ],
        },
        {
          model: Laboratory,
          as: "laboratory",
        },
      ],
    });

    res.json({
      success: true,
      message: "DNA kit order updated successfully",
      data: updatedDNAKit,
    });
  } catch (error) {
    console.error("Error updating DNA kit order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating DNA kit order",
      error: error.message,
    });
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, tracking_number, shipping_carrier, notes } = req.body;

    const dnaKit = await DNAKit.findByPk(id);
    if (!dnaKit) {
      return res.status(404).json({
        success: false,
        message: "DNA kit order not found",
      });
    }

    const updateData = { order_status };

    // Update timestamps based on status
    if (order_status === "shipped" && !dnaKit.shipped_at) {
      updateData.shipped_at = new Date();
      if (tracking_number) updateData.tracking_number = tracking_number;
      if (shipping_carrier) updateData.shipping_carrier = shipping_carrier;
    } else if (order_status === "delivered" && !dnaKit.delivered_at) {
      updateData.delivered_at = new Date();
    } else if (
      order_status === "sample_received" &&
      !dnaKit.sample_received_at
    ) {
      updateData.sample_received_at = new Date();
    } else if (order_status === "completed" && !dnaKit.results_ready_at) {
      updateData.results_ready_at = new Date();
    }

    if (notes) updateData.notes = notes;

    await dnaKit.update(updateData);

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: dnaKit,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

/**
 * Upload test results
 */
exports.uploadTestResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { test_results, results_pdf_url, raw_data_url, sample_quality } =
      req.body;

    const dnaKit = await DNAKit.findByPk(id);
    if (!dnaKit) {
      return res.status(404).json({
        success: false,
        message: "DNA kit order not found",
      });
    }

    await dnaKit.update({
      test_results,
      results_pdf_url,
      raw_data_url,
      sample_quality,
      order_status: "completed",
      results_ready_at: new Date(),
    });

    res.json({
      success: true,
      message: "Test results uploaded successfully",
      data: dnaKit,
    });
  } catch (error) {
    console.error("Error uploading test results:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading test results",
      error: error.message,
    });
  }
};

/**
 * Cancel DNA kit order
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellation_reason } = req.body;

    const dnaKit = await DNAKit.findByPk(id);
    if (!dnaKit) {
      return res.status(404).json({
        success: false,
        message: "DNA kit order not found",
      });
    }

    if (["completed", "cancelled"].includes(dnaKit.order_status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order in current status",
      });
    }

    await dnaKit.update({
      order_status: "cancelled",
      cancellation_reason,
      cancelled_at: new Date(),
    });

    res.json({
      success: true,
      message: "DNA kit order cancelled successfully",
      data: dnaKit,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

/**
 * Get patient DNA kit orders
 */
exports.getPatientDNAKits = async (req, res) => {
  try {
    const { patientId } = req.params;

    const dnaKits = await DNAKit.findAll({
      where: { patient_id: patientId },
      include: [
        {
          model: Laboratory,
          as: "laboratory",
          attributes: ["id", "name", "city", "country"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: dnaKits,
    });
  } catch (error) {
    console.error("Error fetching patient DNA kits:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient DNA kit orders",
      error: error.message,
    });
  }
};

/**
 * Get DNA kit statistics
 */
exports.getDNAKitStatistics = async (req, res) => {
  try {
    const totalOrders = await DNAKit.count();

    const ordersByStatus = await DNAKit.findAll({
      attributes: [
        "order_status",
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "count",
        ],
      ],
      group: ["order_status"],
      raw: true,
    });

    const ordersByType = await DNAKit.findAll({
      attributes: [
        "kit_type",
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "count",
        ],
      ],
      group: ["kit_type"],
      raw: true,
    });

    const totalRevenue = await DNAKit.sum("amount", {
      where: { payment_status: "paid" },
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue || 0,
        ordersByStatus,
        ordersByType,
      },
    });
  } catch (error) {
    console.error("Error fetching DNA kit statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching DNA kit statistics",
      error: error.message,
    });
  }
};

/**
 * Delete DNA kit
 */
exports.deleteDNAKit = async (req, res) => {
  try {
    const { id } = req.params;

    const dnaKit = await DNAKit.findByPk(id);

    if (!dnaKit) {
      return res.status(404).json({
        success: false,
        message: "DNA kit not found",
      });
    }

    await dnaKit.destroy();

    res.status(200).json({
      success: true,
      message: "DNA kit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting DNA kit",
      error: error.message,
    });
  }
};

// Alias for compatibility
exports.getById = exports.getDNAKitById;
