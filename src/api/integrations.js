import apiClient from './apiClient';

const CONTACT_WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL;

const postJson = async (url, payload) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to submit integration request to ${url}`);
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
};

const stripHtml = (html = '') => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return (doc.body.textContent || '').trim();
};
const unsupportedFeature = (featureName) => {
  throw new Error(`Feature not available: ${featureName} is not supported in this application.`);
};

export const Core = {
  sendEnquiry: (data) => apiClient.create('enquiries', data),
  createBooking: (data) => apiClient.create('bookings', data)
};

export const SendEmail = async ({ to, subject, body, metadata = {} }) => {
  if (CONTACT_WEBHOOK_URL) {
    return postJson(CONTACT_WEBHOOK_URL, {
      to,
      subject,
      html: body,
      metadata
    });
  }

  const fallbackPayload = {
    enquiryType: metadata.enquiryType || 'general',
    firstName: metadata.firstName || 'Anonymous',
    lastName: metadata.lastName || 'Enquiry',
    email: metadata.email || to,
    mobile: metadata.mobile || 'N/A',
    message: metadata.message || stripHtml(body) || 'Website contact request',
    vehicleId: metadata.vehicleId,
    notes: metadata.notes
  };

  return Core.sendEnquiry(fallbackPayload);
};

export const UploadFile = async (file) => {
  if (!file) {
    throw new Error('File is required');
  }

  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  const token = apiClient.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiClient.baseURL}/vehicles/import/csv`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to upload CSV file to vehicles import endpoint');
  }

  return response.json();
};

export const UploadPrivateFile = () => unsupportedFeature('private file uploads');

export const CreateFileSignedUrl = () => unsupportedFeature('signed URL creation');

export const ExtractDataFromUploadedFile = () => unsupportedFeature('file data extraction');

export const GenerateImage = () => unsupportedFeature('image generation');

export const InvokeLLM = () => unsupportedFeature('LLM interactions');
