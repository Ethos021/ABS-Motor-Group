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
    throw new Error(errorText || 'Failed to submit integration request');
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
};

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();

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
    firstName: metadata.firstName || 'Website',
    lastName: metadata.lastName || 'Lead',
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

  const response = await fetch(`${apiClient.baseURL}/vehicles/import/csv`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to upload file');
  }

  return response.json();
};

export const UploadPrivateFile = UploadFile;

export const CreateFileSignedUrl = async () => {
  throw new Error('Signed URL creation is not implemented for this application.');
};

export const ExtractDataFromUploadedFile = async () => {
  throw new Error('File data extraction is not available in this application.');
};

export const GenerateImage = async () => {
  throw new Error('Image generation is not part of the ABS Motor Group frontend.');
};

export const InvokeLLM = async () => {
  throw new Error('LLM integrations are not configured for this site.');
};
