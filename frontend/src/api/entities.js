import { apiClient } from "./client";

const normalizeVehicle = (vehicle) => {
  if (!vehicle) return vehicle;
  const price =
    typeof vehicle.price === "string" || typeof vehicle.price === "number"
      ? Number(vehicle.price)
      : vehicle.price;
  return {
    ...vehicle,
    price,
    mileage:
      typeof vehicle.mileage === "string" || typeof vehicle.mileage === "number"
        ? Number(vehicle.mileage)
        : vehicle.mileage,
    body_type: vehicle.body_type ?? vehicle.bodyType ?? "",
    fuel_type: vehicle.fuel_type ?? vehicle.fuelType ?? "",
    stockNumber: vehicle.stockNumber ?? vehicle.stock_number,
  };
};

export const Vehicle = {
  async list() {
    const data = await apiClient.get("/vehicles");
    return Array.isArray(data) ? data.map(normalizeVehicle) : [];
  },
  async get(id) {
    const vehicle = await apiClient.get(`/vehicles/${id}`);
    return normalizeVehicle(vehicle);
  },
  create: (payload) => apiClient.post("/vehicles", payload),
  update: (id, payload) => apiClient.put(`/vehicles/${id}`, payload),
  delete: (id) => apiClient.delete(`/vehicles/${id}`),
  uploadInventoryCsv: (file) => apiClient.uploadCsv("/csv/inventory", file),
};

export const Dealer = {
  list: () => apiClient.get("/dealers"),
  create: (payload) => apiClient.post("/dealers", payload),
  update: (id, payload) => apiClient.put(`/dealers/${id}`, payload),
  delete: (id) => apiClient.delete(`/dealers/${id}`),
};

export const Customer = {
  list: () => apiClient.get("/customers"),
  create: (payload) => apiClient.post("/customers", payload),
  update: (id, payload) => apiClient.put(`/customers/${id}`, payload),
  delete: (id) => apiClient.delete(`/customers/${id}`),
};

export const Sale = {
  list: () => apiClient.get("/sales"),
  create: (payload) => apiClient.post("/sales", payload),
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed =
    typeof value === "string"
      ? Number(value.replace(/[^\d.-]/g, ""))
      : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toBoolean = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return undefined;
};

const mapEnquiryType = (value, { fallback } = {}) => {
  const normalized = String(value ?? "").toLowerCase();
  switch (normalized) {
    case "vehicle_interest":
    case "vehicle":
    case "interest":
      return "vehicle_interest";
    case "test_drive":
    case "test drive":
      return "test_drive";
    case "finance":
      return "finance";
    case "trade_in":
    case "trade-in":
      return "trade_in";
    case "sell_vehicle":
    case "sell":
      return "sell_vehicle";
    case "general":
      return "general";
    default:
      return fallback;
  }
};

const mapPreferredContact = (value) => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "email") return "email";
  if (normalized === "whatsapp") return "whatsapp";
  if (normalized === "phone") return "phone";
  return undefined;
};

const mapEnquiryStatus = (value) => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "contacted") return "contacted";
  if (normalized === "qualified") return "qualified";
  if (normalized === "appointment_set") return "appointment_set";
  if (normalized === "lost") return "lost";
  if (normalized === "closed_won") return "closed_won";
  if (normalized === "closed_lost") return "closed_lost";
  if (normalized === "new") return "new";
  return undefined;
};

const mapEnquiryPriority = (value) => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "low") return "low";
  if (normalized === "high") return "high";
  if (normalized === "urgent") return "urgent";
  if (normalized === "medium") return "medium";
  return undefined;
};

const buildEnquiryPayload = (input = {}, applyDefaults = true) => {
  const payload = {};

  const enquiryType =
    mapEnquiryType(input.enquiryType ?? input.enquiry_type, {
      fallback: applyDefaults ? "general" : undefined,
    }) ?? (applyDefaults ? "general" : undefined);
  if (enquiryType) payload.enquiryType = enquiryType;

  const firstName =
    (input.firstName ?? input.first_name ?? input.name ?? "").toString().trim() ||
    (applyDefaults ? "Customer" : undefined);
  const lastName =
    (input.lastName ?? input.last_name ?? input.surname ?? "").toString().trim() ||
    (applyDefaults ? "Enquiry" : undefined);
  if (firstName) payload.firstName = firstName;
  if (lastName) payload.lastName = lastName;

  const mobile = input.mobile ?? input.phone;
  if (mobile) payload.mobile = mobile;

  if (input.email) payload.email = input.email;
  if (input.message) payload.message = input.message;

  const hasTradein = toBoolean(input.hasTradein ?? input.has_tradein);
  if (hasTradein !== undefined) payload.hasTradein = hasTradein;

  const wantsFinance = toBoolean(input.wantsFinance ?? input.wants_finance);
  if (wantsFinance !== undefined) payload.wantsFinance = wantsFinance;

  const wantsTestDrive = toBoolean(
    input.wantsTestDrive ?? input.wants_test_drive
  );
  if (wantsTestDrive !== undefined) payload.wantsTestDrive = wantsTestDrive;

  const tradeInYear = toNumber(input.tradeInYear ?? input.trade_in_year);
  if (tradeInYear !== undefined) payload.tradeInYear = tradeInYear;

  const tradeInMake = input.tradeInMake ?? input.trade_in_make;
  if (tradeInMake) payload.tradeInMake = tradeInMake;

  const tradeInModel = input.tradeInModel ?? input.trade_in_model;
  if (tradeInModel) payload.tradeInModel = tradeInModel;

  const tradeInOdometer = toNumber(
    input.tradeInOdometer ?? input.trade_in_odometer
  );
  if (tradeInOdometer !== undefined) payload.tradeInOdometer = tradeInOdometer;

  const vehicleId = toNumber(input.vehicleId ?? input.vehicle_id);
  if (vehicleId !== undefined) payload.vehicleId = vehicleId;

  const vehicleDetails = input.vehicleDetails ?? input.vehicle_details;
  if (vehicleDetails) payload.vehicleDetails = vehicleDetails;

  const vehiclePrice = toNumber(input.vehiclePrice ?? input.vehicle_price);
  if (vehiclePrice !== undefined) payload.vehiclePrice = vehiclePrice;

  const financeEstimate = toNumber(
    input.financeEstimate ?? input.finance_estimate
  );
  if (financeEstimate !== undefined) payload.financeEstimate = financeEstimate;

  const preferredContactMethod = mapPreferredContact(
    input.preferredContactMethod ?? input.preferred_contact_method
  );
  if (preferredContactMethod)
    payload.preferredContactMethod = preferredContactMethod;

  const preferredContactTime =
    input.preferredContactTime ?? input.preferred_contact_time;
  if (preferredContactTime) payload.preferredContactTime = preferredContactTime;

  if (input.utmSource ?? input.utm_source)
    payload.utmSource = input.utmSource ?? input.utm_source;
  if (input.utmMedium ?? input.utm_medium)
    payload.utmMedium = input.utmMedium ?? input.utm_medium;
  if (input.utmCampaign ?? input.utm_campaign)
    payload.utmCampaign = input.utmCampaign ?? input.utm_campaign;

  if (input.referrer) payload.referrer = input.referrer;
  if (input.pageUrl ?? input.page_url)
    payload.pageUrl = input.pageUrl ?? input.page_url;

  const status = mapEnquiryStatus(input.status);
  if (status) payload.status = status;

  const priority = mapEnquiryPriority(input.priority);
  if (priority) payload.priority = priority;

  const assignedStaffId = toNumber(
    input.assignedStaffId ?? input.assigned_staff_id
  );
  if (assignedStaffId !== undefined) payload.assignedStaffId = assignedStaffId;

  if (input.contactedAt ?? input.contacted_at)
    payload.contactedAt = input.contactedAt ?? input.contacted_at;
  if (input.closedAt ?? input.closed_at)
    payload.closedAt = input.closedAt ?? input.closed_at;
  if (input.internalNotes ?? input.internal_notes)
    payload.internalNotes = input.internalNotes ?? input.internal_notes;

  return payload;
};

const normalizeEnquiryResponse = (enquiry) => {
  if (!enquiry) return enquiry;
  return {
    ...enquiry,
    enquiryType: enquiry.enquiryType ?? enquiry.enquiry_type,
    enquiry_type: enquiry.enquiry_type ?? enquiry.enquiryType,
    firstName: enquiry.firstName ?? enquiry.first_name,
    first_name: enquiry.first_name ?? enquiry.firstName,
    lastName: enquiry.lastName ?? enquiry.last_name,
    last_name: enquiry.last_name ?? enquiry.lastName,
    created_date: enquiry.created_date ?? enquiry.createdAt,
    updated_date: enquiry.updated_date ?? enquiry.updatedAt,
    tradeInMake: enquiry.tradeInMake ?? enquiry.trade_in_make,
    trade_in_make: enquiry.trade_in_make ?? enquiry.tradeInMake,
    tradeInModel: enquiry.tradeInModel ?? enquiry.trade_in_model,
    trade_in_model: enquiry.trade_in_model ?? enquiry.tradeInModel,
    tradeInYear: enquiry.tradeInYear ?? enquiry.trade_in_year,
    trade_in_year: enquiry.trade_in_year ?? enquiry.tradeInYear,
    tradeInOdometer: enquiry.tradeInOdometer ?? enquiry.trade_in_odometer,
    trade_in_odometer: enquiry.trade_in_odometer ?? enquiry.tradeInOdometer,
    assignedStaffId: enquiry.assignedStaffId ?? enquiry.assigned_staff_id,
    assigned_staff_id: enquiry.assigned_staff_id ?? enquiry.assignedStaffId,
    preferredContactMethod:
      enquiry.preferredContactMethod ?? enquiry.preferred_contact_method,
    preferred_contact_method:
      enquiry.preferred_contact_method ?? enquiry.preferredContactMethod,
    contactedAt: enquiry.contactedAt ?? enquiry.contacted_at,
    contacted_at: enquiry.contacted_at ?? enquiry.contactedAt,
    closedAt: enquiry.closedAt ?? enquiry.closed_at,
    closed_at: enquiry.closed_at ?? enquiry.closedAt,
    internalNotes: enquiry.internalNotes ?? enquiry.internal_notes,
    internal_notes: enquiry.internal_notes ?? enquiry.internalNotes,
  };
};

const mapBookingStatus = (value) => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "confirmed") return "confirmed";
  if (normalized === "completed") return "completed";
  if (normalized === "cancelled") return "cancelled";
  if (normalized === "no_show") return "no_show";
  if (normalized === "pending") return "pending";
  return undefined;
};

const mapBookingType = (value) => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "test_drive" || normalized === "test drive")
    return "test_drive";
  if (normalized === "inspection") return "inspection";
  if (normalized === "finance_meeting" || normalized === "finance meeting")
    return "finance_meeting";
  if (normalized === "delivery") return "delivery";
  if (normalized === "consultation") return "consultation";
  return undefined;
};

const buildBookingPayload = (input = {}, applyDefaults = true) => {
  const payload = {};

  const bookingType =
    mapBookingType(input.bookingType ?? input.booking_type) ??
    (applyDefaults ? "test_drive" : undefined);
  if (bookingType) payload.bookingType = bookingType;

  const scheduledDatetime =
    input.scheduledDatetime ?? input.scheduled_datetime;
  if (scheduledDatetime) payload.scheduledDatetime = scheduledDatetime;

  const durationMinutes = toNumber(
    input.durationMinutes ?? input.duration_minutes
  );
  if (durationMinutes !== undefined) payload.durationMinutes = durationMinutes;
  else if (applyDefaults) payload.durationMinutes = 60;

  const staffId = toNumber(input.staffId ?? input.staff_id);
  if (staffId !== undefined) payload.staffId = staffId;

  const enquiryId = toNumber(input.enquiryId ?? input.enquiry_id);
  if (enquiryId !== undefined) payload.enquiryId = enquiryId;

  const vehicleId = toNumber(input.vehicleId ?? input.vehicle_id);
  if (vehicleId !== undefined) payload.vehicleId = vehicleId;

  if (input.vehicleSnapshot ?? input.vehicle_snapshot)
    payload.vehicleSnapshot = input.vehicleSnapshot ?? input.vehicle_snapshot;

  const customerName =
    (input.customerName ?? input.customer_name ?? "").toString().trim() ||
    (applyDefaults ? "Customer" : undefined);
  if (customerName) payload.customerName = customerName;

  if (input.customerEmail ?? input.customer_email)
    payload.customerEmail = input.customerEmail ?? input.customer_email;

  const customerPhone =
    (input.customerPhone ?? input.customer_phone ?? "").toString().trim() ||
    (applyDefaults ? "N/A" : undefined);
  if (customerPhone) payload.customerPhone = customerPhone;

  const status = mapBookingStatus(input.status);
  if (status) payload.status = status;
  else if (applyDefaults) payload.status = "pending";

  if (input.confirmationSent !== undefined)
    payload.confirmationSent = input.confirmationSent;
  if (input.reminderSent !== undefined) payload.reminderSent = input.reminderSent;
  if (input.notes) payload.notes = input.notes;
  if (input.customerNotes ?? input.customer_notes)
    payload.customerNotes = input.customerNotes ?? input.customer_notes;
  if (input.cancellationReason ?? input.cancellation_reason)
    payload.cancellationReason =
      input.cancellationReason ?? input.cancellation_reason;
  if (input.cancelledAt ?? input.cancelled_at)
    payload.cancelledAt = input.cancelledAt ?? input.cancelled_at;

  return payload;
};

const normalizeBooking = (booking) => {
  if (!booking) return booking;
  return {
    ...booking,
    bookingType: booking.bookingType ?? booking.booking_type,
    booking_type: booking.booking_type ?? booking.bookingType,
    scheduledDatetime:
      booking.scheduledDatetime ?? booking.scheduled_datetime,
    scheduled_datetime:
      booking.scheduled_datetime ?? booking.scheduledDatetime,
    durationMinutes: booking.durationMinutes ?? booking.duration_minutes,
    duration_minutes: booking.duration_minutes ?? booking.durationMinutes,
    customerName: booking.customerName ?? booking.customer_name,
    customer_name: booking.customer_name ?? booking.customerName,
    customerPhone: booking.customerPhone ?? booking.customer_phone,
    customer_phone: booking.customer_phone ?? booking.customerPhone,
    customerEmail: booking.customerEmail ?? booking.customer_email,
    customer_email: booking.customer_email ?? booking.customerEmail,
    staffId: booking.staffId ?? booking.staff_id,
    staff_id: booking.staff_id ?? booking.staffId,
    vehicleId: booking.vehicleId ?? booking.vehicle_id,
    vehicle_id: booking.vehicle_id ?? booking.vehicleId,
    enquiryId: booking.enquiryId ?? booking.enquiry_id,
    enquiry_id: booking.enquiry_id ?? booking.enquiryId,
  };
};

const mapStaffRole = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  if (["SALES", "FINANCE", "MANAGER", "SERVICE_ADVISOR"].includes(normalized)) {
    return normalized;
  }
  return undefined;
};

const buildStaffPayload = (input = {}, applyDefaults = true) => {
  const payload = {};
  const fullName =
    (input.fullName ?? input.full_name ?? "").toString().trim() ||
    (applyDefaults ? "Staff Member" : undefined);
  if (fullName) payload.fullName = fullName;
  if (input.email) payload.email = input.email;
  if (input.phone) payload.phone = input.phone;

  const role = mapStaffRole(input.role ?? input.staffRole);
  if (role) payload.role = role;

  const isActive = toBoolean(input.isActive ?? input.is_active);
  if (isActive !== undefined) payload.isActive = isActive;
  else if (applyDefaults) payload.isActive = true;

  return payload;
};

const normalizeStaff = (staff) => {
  if (!staff) return staff;
  return {
    ...staff,
    fullName: staff.fullName ?? staff.full_name,
    full_name: staff.full_name ?? staff.fullName,
    isActive: staff.isActive ?? staff.is_active,
    is_active: staff.is_active ?? staff.isActive,
  };
};

const mapBlockType = (value) => {
  const normalized = String(value ?? "").toLowerCase();
  if (["holiday", "meeting", "maintenance", "training", "other"].includes(normalized))
    return normalized;
  return undefined;
};

const mapRecurrencePattern = (value) => {
  const normalized = String(value ?? "").toLowerCase();
  if (["daily", "weekly", "monthly", "yearly"].includes(normalized))
    return normalized;
  return undefined;
};

const buildCalendarBlockPayload = (input = {}, applyDefaults = true) => {
  const payload = {};
  const title = (input.title ?? "").toString().trim();
  if (title) payload.title = title;

  const startDatetime = input.startDatetime ?? input.start_datetime;
  if (startDatetime) payload.startDatetime = startDatetime;

  const endDatetime = input.endDatetime ?? input.end_datetime;
  if (endDatetime) payload.endDatetime = endDatetime;

  const isRecurring = toBoolean(input.isRecurring ?? input.is_recurring);
  if (isRecurring !== undefined) payload.isRecurring = isRecurring;
  else if (applyDefaults) payload.isRecurring = false;

  const recurrencePattern = mapRecurrencePattern(
    input.recurrencePattern ?? input.recurrence_pattern
  );
  if (recurrencePattern) payload.recurrencePattern = recurrencePattern;

  if (input.recurrenceEndDate ?? input.recurrence_end_date)
    payload.recurrenceEndDate =
      input.recurrenceEndDate ?? input.recurrence_end_date;

  const blockType =
    mapBlockType(input.blockType ?? input.block_type) ??
    (applyDefaults ? "holiday" : undefined);
  if (blockType) payload.blockType = blockType;

  const staffId = toNumber(input.staffId ?? input.staff_id);
  if (staffId !== undefined) payload.staffId = staffId;

  if (input.notes) payload.notes = input.notes;

  const isActive = toBoolean(input.isActive ?? input.is_active);
  if (isActive !== undefined) payload.isActive = isActive;
  else if (applyDefaults) payload.isActive = true;

  return payload;
};

const normalizeCalendarBlock = (block) => {
  if (!block) return block;
  return {
    ...block,
    startDatetime: block.startDatetime ?? block.start_datetime,
    start_datetime: block.start_datetime ?? block.startDatetime,
    endDatetime: block.endDatetime ?? block.end_datetime,
    end_datetime: block.end_datetime ?? block.endDatetime,
    isRecurring: block.isRecurring ?? block.is_recurring,
    is_recurring: block.is_recurring ?? block.isRecurring,
    recurrencePattern:
      block.recurrencePattern ?? block.recurrence_pattern,
    recurrence_pattern:
      block.recurrence_pattern ?? block.recurrencePattern,
    recurrenceEndDate:
      block.recurrenceEndDate ?? block.recurrence_end_date,
    recurrence_end_date:
      block.recurrence_end_date ?? block.recurrenceEndDate,
    blockType: block.blockType ?? block.block_type,
    block_type: block.block_type ?? block.blockType,
    staffId: block.staffId ?? block.staff_id,
    staff_id: block.staff_id ?? block.staffId,
    isActive: block.isActive ?? block.is_active,
    is_active: block.is_active ?? block.isActive,
  };
};

export const Enquiry = {
  async list() {
    const data = await apiClient.get("/enquiries");
    return Array.isArray(data) ? data.map(normalizeEnquiryResponse) : [];
  },
  async create(payload) {
    const data = await apiClient.post(
      "/enquiries",
      buildEnquiryPayload(payload, true)
    );
    return normalizeEnquiryResponse(data);
  },
  async update(id, payload) {
    const data = await apiClient.put(
      `/enquiries/${id}`,
      buildEnquiryPayload(payload, false)
    );
    return normalizeEnquiryResponse(data);
  },
};

export const Booking = {
  async list() {
    const data = await apiClient.get("/bookings");
    return Array.isArray(data) ? data.map(normalizeBooking) : [];
  },
  async create(payload) {
    const data = await apiClient.post(
      "/bookings",
      buildBookingPayload(payload, true)
    );
    return normalizeBooking(data);
  },
  async update(id, payload) {
    const data = await apiClient.put(
      `/bookings/${id}`,
      buildBookingPayload(payload, false)
    );
    return normalizeBooking(data);
  },
};

export const Staff = {
  async list() {
    const data = await apiClient.get("/staff");
    return Array.isArray(data) ? data.map(normalizeStaff) : [];
  },
  async create(payload) {
    const data = await apiClient.post(
      "/staff",
      buildStaffPayload(payload, true)
    );
    return normalizeStaff(data);
  },
  async update(id, payload) {
    const data = await apiClient.put(
      `/staff/${id}`,
      buildStaffPayload(payload, false)
    );
    return normalizeStaff(data);
  },
};

export const CalendarBlock = {
  async list() {
    const data = await apiClient.get("/calendar-blocks");
    return Array.isArray(data) ? data.map(normalizeCalendarBlock) : [];
  },
  async create(payload) {
    const data = await apiClient.post(
      "/calendar-blocks",
      buildCalendarBlockPayload(payload, true)
    );
    return normalizeCalendarBlock(data);
  },
  async update(id, payload) {
    const data = await apiClient.put(
      `/calendar-blocks/${id}`,
      buildCalendarBlockPayload(payload, false)
    );
    return normalizeCalendarBlock(data);
  },
  async delete(id) {
    await apiClient.delete(`/calendar-blocks/${id}`);
  },
};

const defaultUser = { id: 1, role: "admin", email: "admin@example.com" };
export const User = {
  isAuthenticated: () => true,
  getProfile: async () => defaultUser,
};
