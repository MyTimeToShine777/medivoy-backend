/**
 * Doctor Schedule Controller
 * Handles doctor availability schedules and time slots
 */

const { Op } = require('sequelize');
const { DoctorSchedule, Doctor, Hospital, Appointment, User } = require('../models');

/**
 * Create a new doctor schedule
 */
exports.createSchedule = async (req, res) => {
  try {
    const {
      doctor_id,
      hospital_id,
      day_of_week,
      start_time,
      end_time,
      slot_duration,
      max_patients_per_slot,
      consultation_type,
      consultation_fee,
      currency,
      is_recurring,
      effective_from,
      effective_to,
      break_start_time,
      break_end_time,
      location,
      notes
    } = req.body;

    // Validate doctor exists
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check for overlapping schedules
    const overlapping = await DoctorSchedule.findOne({
      where: {
        doctor_id,
        hospital_id: hospital_id || null,
        day_of_week,
        is_active: true,
        [Op.or]: [
          {
            start_time: { [Op.between]: [start_time, end_time] }
          },
          {
            end_time: { [Op.between]: [start_time, end_time] }
          },
          {
            [Op.and]: [
              { start_time: { [Op.lte]: start_time } },
              { end_time: { [Op.gte]: end_time } }
            ]
          }
        ]
      }
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: 'Schedule overlaps with existing schedule for this day'
      });
    }

    const schedule = await DoctorSchedule.create({
      doctor_id,
      hospital_id,
      day_of_week,
      start_time,
      end_time,
      slot_duration: slot_duration || 30,
      max_patients_per_slot: max_patients_per_slot || 1,
      consultation_type: consultation_type || 'both',
      consultation_fee,
      currency: currency || 'USD',
      is_recurring: is_recurring !== false,
      effective_from: effective_from || new Date(),
      effective_to,
      break_start_time,
      break_end_time,
      location,
      notes,
      is_active: true
    });

    res.status(201).json({
      success: true,
      message: 'Doctor schedule created successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Error creating doctor schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating doctor schedule',
      error: error.message
    });
  }
};

/**
 * Get all schedules for a doctor
 */
exports.getDoctorSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { hospitalId, isActive } = req.query;

    const whereClause = { doctor_id: doctorId };
    if (hospitalId) whereClause.hospital_id = hospitalId;
    if (isActive !== undefined) whereClause.is_active = isActive === 'true';

    const schedules = await DoctorSchedule.findAll({
      where: whereClause,
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] }]
        },
        {
          model: Hospital,
          as: 'hospital',
          attributes: ['id', 'name', 'city', 'country']
        }
      ],
      order: [
        ['day_of_week', 'ASC'],
        ['start_time', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Error fetching doctor schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor schedules',
      error: error.message
    });
  }
};

/**
 * Get a specific schedule
 */
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await DoctorSchedule.findByPk(id, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] }]
        },
        {
          model: Hospital,
          as: 'hospital',
          attributes: ['id', 'name', 'city', 'country']
        }
      ]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedule',
      error: error.message
    });
  }
};

/**
 * Update a doctor schedule
 */
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const schedule = await DoctorSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Check for overlapping schedules if time is being updated
    if (updateData.start_time || updateData.end_time || updateData.day_of_week) {
      const overlapping = await DoctorSchedule.findOne({
        where: {
          id: { [Op.ne]: id },
          doctor_id: schedule.doctor_id,
          hospital_id: schedule.hospital_id || null,
          day_of_week: updateData.day_of_week || schedule.day_of_week,
          is_active: true,
          [Op.or]: [
            {
              start_time: {
                [Op.between]: [
                  updateData.start_time || schedule.start_time,
                  updateData.end_time || schedule.end_time
                ]
              }
            },
            {
              end_time: {
                [Op.between]: [
                  updateData.start_time || schedule.start_time,
                  updateData.end_time || schedule.end_time
                ]
              }
            }
          ]
        }
      });

      if (overlapping) {
        return res.status(400).json({
          success: false,
          message: 'Updated schedule overlaps with existing schedule'
        });
      }
    }

    await schedule.update(updateData);

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule',
      error: error.message
    });
  }
};

/**
 * Delete a doctor schedule
 */
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await DoctorSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Soft delete by setting is_active to false
    await schedule.update({ is_active: false });

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting schedule',
      error: error.message
    });
  }
};

/**
 * Get available time slots for a doctor on a specific date
 */
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, hospitalId, consultationType } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][requestedDate.getDay()];

    // Get doctor's schedule for the day
    const whereClause = {
      doctor_id: doctorId,
      day_of_week: dayOfWeek,
      is_active: true,
      effective_from: { [Op.lte]: requestedDate }
    };

    if (hospitalId) whereClause.hospital_id = hospitalId;
    if (consultationType) whereClause.consultation_type = { [Op.in]: [consultationType, 'both'] };

    const schedules = await DoctorSchedule.findAll({
      where: {
        ...whereClause,
        [Op.or]: [
          { effective_to: null },
          { effective_to: { [Op.gte]: requestedDate } }
        ]
      }
    });

    if (schedules.length === 0) {
      return res.json({
        success: true,
        message: 'No schedules found for this date',
        data: []
      });
    }

    // Get existing appointments for the date
    const existingAppointments = await Appointment.findAll({
      where: {
        doctor_id: doctorId,
        appointment_date: date,
        status: { [Op.notIn]: ['cancelled', 'rejected'] }
      },
      attributes: ['appointment_time', 'duration']
    });

    // Generate available slots
    const availableSlots = [];

    for (const schedule of schedules) {
      const slots = generateTimeSlots(
        schedule.start_time,
        schedule.end_time,
        schedule.slot_duration,
        schedule.break_start_time,
        schedule.break_end_time
      );

      // Filter out booked slots
      const bookedTimes = existingAppointments.map(apt => apt.appointment_time);
      const available = slots.filter(slot => !bookedTimes.includes(slot));

      availableSlots.push({
        schedule_id: schedule.id,
        hospital_id: schedule.hospital_id,
        consultation_type: schedule.consultation_type,
        consultation_fee: schedule.consultation_fee,
        currency: schedule.currency,
        slots: available
      });
    }

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};

/**
 * Helper function to generate time slots
 */
function generateTimeSlots(startTime, endTime, duration, breakStart, breakEnd) {
  const slots = [];
  let current = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const breakStartMin = breakStart ? timeToMinutes(breakStart) : null;
  const breakEndMin = breakEnd ? timeToMinutes(breakEnd) : null;

  while (current + duration <= end) {
    // Skip break time
    if (breakStartMin && breakEndMin && current >= breakStartMin && current < breakEndMin) {
      current = breakEndMin;
      continue;
    }

    slots.push(minutesToTime(current));
    current += duration;
  }

  return slots;
}

/**
 * Convert time string to minutes
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes to time string
 */
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Bulk create schedules for a doctor
 */
exports.bulkCreateSchedules = async (req, res) => {
  try {
    const { schedules } = req.body;

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Schedules array is required'
      });
    }

    const createdSchedules = await DoctorSchedule.bulkCreate(schedules, {
      validate: true
    });

    res.status(201).json({
      success: true,
      message: `${createdSchedules.length} schedules created successfully`,
      data: createdSchedules
    });
  } catch (error) {
    console.error('Error bulk creating schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk creating schedules',
      error: error.message
    });
  }
};