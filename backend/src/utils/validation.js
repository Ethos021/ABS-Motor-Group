// Validation utility for database operations

/**
 * Allowed fields for each entity to prevent arbitrary field injection
 */
export const ALLOWED_FIELDS = {
  enquiry: [
    'enquiry_type', 'firstName', 'lastName', 'mobile', 'email', 'message',
    'hasTradein', 'tradeInYear', 'tradeInMake', 'tradeInModel', 'tradeInOdometer',
    'wantsFinance', 'wantsTestDrive', 'vehicleId', 'vehicleDetails', 'vehiclePrice',
    'vehicleSnapshot', 'financeEstimate', 'preferredContactMethod', 'preferredContactTime',
    'utmSource', 'utmMedium', 'utmCampaign', 'referrer', 'pageUrl', 'ipAddress',
    'status', 'priority', 'assignedStaffId', 'contactedAt', 'closedAt', 'internalNotes',
    'created_by'
  ],
  staff: [
    'full_name', 'email', 'phone', 'role', 'is_active', 'availability_hours',
    'created_by'
  ],
  calendarBlock: [
    'title', 'start_datetime', 'end_datetime', 'is_recurring', 'recurrence_pattern',
    'recurrence_end_date', 'block_type', 'staff_id', 'notes', 'is_active',
    'created_by'
  ],
  booking: [
    'enquiry_id', 'booking_type', 'scheduled_datetime', 'duration_minutes',
    'staff_id', 'vehicle_id', 'vehicle_snapshot', 'customer_name', 'customer_email',
    'customer_phone', 'status', 'confirmation_sent', 'reminder_sent', 'notes',
    'customer_notes', 'cancellation_reason', 'cancelled_at',
    'created_by'
  ]
};

/**
 * Filter object to only include allowed fields
 * @param {Object} data - The data object to filter
 * @param {Array<string>} allowedFields - List of allowed field names
 * @returns {Object} Filtered object with only allowed fields
 */
export function filterAllowedFields(data, allowedFields) {
  const filtered = {};
  for (const key of Object.keys(data)) {
    if (allowedFields.includes(key) && data[key] !== undefined) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}

/**
 * Sanitize field names to prevent SQL injection via field names
 * This is an extra layer of protection beyond parameterized queries
 * @param {string} fieldName - The field name to sanitize
 * @returns {boolean} True if field name is valid
 */
export function isValidFieldName(fieldName) {
  // Only allow alphanumeric characters and underscores
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName);
}
