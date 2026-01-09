import CalendarBlock from '../models/CalendarBlock.js';

export const createCalendarBlock = async (req, res) => {
  try {
    const blockData = {
      ...req.body,
      created_by: req.user?.id || null
    };
    
    const block = await CalendarBlock.create(blockData);
    res.status(201).json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error('Error creating calendar block:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create calendar block',
      error: error.message
    });
  }
};

export const getCalendarBlocks = async (req, res) => {
  try {
    const filters = {
      staff_id: req.query.staff_id,
      block_type: req.query.block_type,
      is_active: req.query.is_active ? req.query.is_active === 'true' : undefined,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };

    const blocks = await CalendarBlock.findAll(filters);
    res.json({
      success: true,
      data: blocks,
      count: blocks.length
    });
  } catch (error) {
    console.error('Error fetching calendar blocks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar blocks',
      error: error.message
    });
  }
};

export const getCalendarBlockById = async (req, res) => {
  try {
    const block = await CalendarBlock.findById(req.params.id);
    
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Calendar block not found'
      });
    }

    res.json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error('Error fetching calendar block:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar block',
      error: error.message
    });
  }
};

export const updateCalendarBlock = async (req, res) => {
  try {
    const block = await CalendarBlock.update(req.params.id, req.body);
    
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Calendar block not found'
      });
    }

    res.json({
      success: true,
      data: block
    });
  } catch (error) {
    console.error('Error updating calendar block:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update calendar block',
      error: error.message
    });
  }
};

export const deleteCalendarBlock = async (req, res) => {
  try {
    const block = await CalendarBlock.delete(req.params.id);
    
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Calendar block not found'
      });
    }

    res.json({
      success: true,
      message: 'Calendar block deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting calendar block:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete calendar block',
      error: error.message
    });
  }
};

export const getBlocksByDateRange = async (req, res) => {
  try {
    const { start_date, end_date, staff_id } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date and end_date are required'
      });
    }

    const blocks = await CalendarBlock.findByDateRange(start_date, end_date, staff_id);
    res.json({
      success: true,
      data: blocks,
      count: blocks.length
    });
  } catch (error) {
    console.error('Error fetching calendar blocks by date range:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar blocks',
      error: error.message
    });
  }
};
