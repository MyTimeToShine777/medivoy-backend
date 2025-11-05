/**
 * Staff Controller
 * Handles staff management operations
 */

const { Op } = require('sequelize');
const { Staff, User, Hospital } = require('../models');

/**
 * Get all staff members
 */
exports.getAllStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      staffType,
      hospitalId,
      employmentStatus,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { employee_id: { [Op.iLike]: `%${search}%` } },
        { department: { [Op.iLike]: `%${search}%` } },
        { designation: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (staffType) whereClause.staff_type = staffType;
    if (hospitalId) whereClause.hospital_id = hospitalId;
    if (employmentStatus) whereClause.employment_status = employmentStatus;

    const { count, rows } = await Staff.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'role',
          ],
        },
        {
          model: Hospital,
          as: 'hospital',
          attributes: ['id', 'name', 'city', 'country'],
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
    console.error('Error fetching staff:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff members',
      error: error.message,
    });
  }
};

/**
 * Get staff member by ID
 */
exports.getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'role',
            'is_active',
          ],
        },
        {
          model: Hospital,
          as: 'hospital',
          attributes: ['id', 'name', 'city', 'country', 'address'],
        },
      ],
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff member',
      error: error.message,
    });
  }
};

/**
 * Create new staff member
 */
exports.createStaff = async (req, res) => {
  try {
    const {
      user_id,
      staff_type,
      employee_id,
      department,
      designation,
      hospital_id,
      specialization,
      qualifications,
      experience_years,
      date_of_joining,
      employment_status,
      work_schedule,
      assigned_regions,
      languages,
      contact_number,
      emergency_contact,
      address,
      city,
      country,
      salary,
      commission_rate,
      permissions,
      notes,
      profile_image,
    } = req.body;

    // Validate user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if staff profile already exists for this user
    const existingStaff = await Staff.findOne({ where: { user_id } });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'Staff profile already exists for this user',
      });
    }

    // Generate employee ID if not provided
    const generatedEmployeeId = employee_id || `EMP-${Date.now()}`;

    const staff = await Staff.create({
      user_id,
      staff_type: staff_type || 'support',
      employee_id: generatedEmployeeId,
      department,
      designation,
      hospital_id,
      specialization,
      qualifications,
      experience_years: experience_years || 0,
      date_of_joining: date_of_joining || new Date(),
      employment_status: employment_status || 'active',
      work_schedule,
      assigned_regions,
      languages,
      contact_number,
      emergency_contact,
      address,
      city,
      country,
      salary,
      commission_rate,
      permissions,
      notes,
      profile_image,
      is_active: true,
    });

    // Update user role if needed
    if (user.role === 'user') {
      await user.update({ role: 'staff' });
    }

    const staffWithDetails = await Staff.findByPk(staff.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
        },
        {
          model: Hospital,
          as: 'hospital',
          attributes: ['id', 'name', 'city', 'country'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: staffWithDetails,
    });
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating staff member',
      error: error.message,
    });
  }
};

/**
 * Update staff member
 */
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    await staff.update(updateData);

    const updatedStaff = await Staff.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
        },
        {
          model: Hospital,
          as: 'hospital',
          attributes: ['id', 'name', 'city', 'country'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: updatedStaff,
    });
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating staff member',
      error: error.message,
    });
  }
};

/**
 * Delete staff member
 */
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    // Soft delete by setting is_active to false
    await staff.update({ is_active: false, employment_status: 'terminated' });

    res.json({
      success: true,
      message: 'Staff member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting staff member',
      error: error.message,
    });
  }
};

/**
 * Get staff performance metrics
 */
exports.getStaffPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const staff = await Staff.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email'],
        },
      ],
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    // Calculate performance metrics based on staff type
    const metrics = {
      staff_id: staff.id,
      staff_name: `${staff.user.first_name} ${staff.user.last_name}`,
      staff_type: staff.staff_type,
      total_bookings_handled: staff.total_bookings_handled,
      total_revenue_generated: staff.total_revenue_generated,
      performance_rating: staff.performance_rating,
      employment_status: staff.employment_status,
    };

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching staff performance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff performance',
      error: error.message,
    });
  }
};

/**
 * Update staff permissions
 */
exports.updateStaffPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    await staff.update({ permissions });

    res.json({
      success: true,
      message: 'Staff permissions updated successfully',
      data: { permissions: staff.permissions },
    });
  } catch (error) {
    console.error('Error updating staff permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating staff permissions',
      error: error.message,
    });
  }
};

/**
 * Get staff by hospital
 */
exports.getStaffByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { staffType, employmentStatus } = req.query;

    const whereClause = { hospital_id: hospitalId };
    if (staffType) whereClause.staff_type = staffType;
    if (employmentStatus) whereClause.employment_status = employmentStatus;

    const staff = await Staff.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error('Error fetching hospital staff:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hospital staff',
      error: error.message,
    });
  }
};
