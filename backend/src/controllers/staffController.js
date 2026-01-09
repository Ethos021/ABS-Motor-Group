import Staff from '../models/Staff.js';

export const createStaff = async (req, res) => {
  try {
    const staffData = {
      ...req.body,
      created_by: req.user?.id || null
    };
    
    const staff = await Staff.create(staffData);
    res.status(201).json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create staff member',
      error: error.message
    });
  }
};

export const getStaff = async (req, res) => {
  try {
    const filters = {
      role: req.query.role,
      is_active: req.query.is_active ? req.query.is_active === 'true' : undefined
    };

    const staff = await Staff.findAll(filters);
    res.json({
      success: true,
      data: staff,
      count: staff.length
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff',
      error: error.message
    });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff member',
      error: error.message
    });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.update(req.params.id, req.body);
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update staff member',
      error: error.message
    });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.delete(req.params.id);
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete staff member',
      error: error.message
    });
  }
};
