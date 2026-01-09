import Enquiry from '../models/Enquiry.js';

export const createEnquiry = async (req, res) => {
  try {
    const enquiryData = {
      ...req.body,
      created_by: req.user?.id || null
    };
    
    const enquiry = await Enquiry.create(enquiryData);
    res.status(201).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create enquiry',
      error: error.message
    });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      enquiry_type: req.query.enquiry_type,
      assignedStaffId: req.query.assignedStaffId,
      limit: parseInt(req.query.limit) || undefined,
      offset: parseInt(req.query.offset) || undefined
    };

    const enquiries = await Enquiry.findAll(filters);
    res.json({
      success: true,
      data: enquiries,
      count: enquiries.length
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries',
      error: error.message
    });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry',
      error: error.message
    });
  }
};

export const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.update(req.params.id, req.body);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry',
      error: error.message
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.delete(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry',
      error: error.message
    });
  }
};

export const searchEnquiries = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const enquiries = await Enquiry.search(q);
    res.json({
      success: true,
      data: enquiries,
      count: enquiries.length
    });
  } catch (error) {
    console.error('Error searching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search enquiries',
      error: error.message
    });
  }
};
