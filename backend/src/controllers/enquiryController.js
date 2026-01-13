import enquiryService from '../services/enquiryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await enquiryService.getAllEnquiries(req.query);

  res.status(200).json({
    success: true,
    count: enquiries.length,
    data: enquiries,
  });
});

export const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.getEnquiryById(req.params.id);

  res.status(200).json({
    success: true,
    data: enquiry,
  });
});

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.createEnquiry(req.body);

  res.status(201).json({
    success: true,
    data: enquiry,
  });
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.updateEnquiry(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: enquiry,
  });
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  await enquiryService.deleteEnquiry(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Enquiry deleted successfully',
  });
});
