import { BookingStatus, BookingType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/db.js";

type Input = Record<string, unknown>;

const toStringIfPresent = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  const str = String(value).trim();
  return str.length ? str : undefined;
};

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed =
    typeof value === "string"
      ? Number(value.replace(/[^\d.-]/g, ""))
      : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const mapBookingType = (value: unknown): BookingType | undefined => {
  const normalized = String(value ?? "").toLowerCase();
  switch (normalized) {
    case "test_drive":
    case "test drive":
      return BookingType.test_drive;
    case "inspection":
      return BookingType.inspection;
    case "finance_meeting":
    case "finance meeting":
      return BookingType.finance_meeting;
    case "delivery":
      return BookingType.delivery;
    case "consultation":
      return BookingType.consultation;
    default:
      return undefined;
  }
};

const mapBookingStatus = (value: unknown): BookingStatus | undefined => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "confirmed") return BookingStatus.confirmed;
  if (normalized === "completed") return BookingStatus.completed;
  if (normalized === "cancelled") return BookingStatus.cancelled;
  if (normalized === "no_show") return BookingStatus.no_show;
  if (normalized === "pending") return BookingStatus.pending;
  return undefined;
};

const baseBookingSchema = z.object({
  bookingType: z.nativeEnum(BookingType).optional(),
  scheduledDatetime: z.coerce.date().optional(),
  durationMinutes: z.coerce.number().int().positive().optional(),
  staffId: z.coerce.number().int().optional(),
  enquiryId: z.coerce.number().int().optional(),
  vehicleId: z.coerce.number().int().optional(),
  vehicleSnapshot: z.any().optional(),
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(1).optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  confirmationSent: z.boolean().optional(),
  reminderSent: z.boolean().optional(),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
  cancellationReason: z.string().optional(),
  cancelledAt: z.coerce.date().optional(),
});

export const bookingSchema = baseBookingSchema.extend({
  bookingType: z.nativeEnum(BookingType),
  scheduledDatetime: z.coerce.date(),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
});

export const bookingUpdateSchema = baseBookingSchema;

const normalizeBookingPayload = (
  input: Input,
  { applyDefaults }: { applyDefaults: boolean }
) => {
  const normalized: Record<string, unknown> = {
    bookingType:
      mapBookingType(input.bookingType) ??
      mapBookingType(input.booking_type) ??
      undefined,
    scheduledDatetime:
      toDate(input.scheduledDatetime ?? input.scheduled_datetime) ?? undefined,
    durationMinutes: toNumber(
      input.durationMinutes ?? input.duration_minutes
    ),
    staffId: toNumber(input.staffId ?? input.staff_id),
    enquiryId: toNumber(input.enquiryId ?? input.enquiry_id),
    vehicleId: toNumber(input.vehicleId ?? input.vehicle_id),
    vehicleSnapshot: input.vehicleSnapshot ?? input.vehicle_snapshot,
    customerName:
      toStringIfPresent(input.customerName ?? input.customer_name) ?? undefined,
    customerEmail: toStringIfPresent(
      input.customerEmail ?? input.customer_email
    ),
    customerPhone:
      toStringIfPresent(input.customerPhone ?? input.customer_phone) ??
      undefined,
    status:
      mapBookingStatus(input.status) ?? mapBookingStatus(input.booking_status),
    confirmationSent:
      typeof input.confirmationSent === "boolean"
        ? input.confirmationSent
        : undefined,
    reminderSent:
      typeof input.reminderSent === "boolean" ? input.reminderSent : undefined,
    notes: toStringIfPresent(input.notes),
    customerNotes: toStringIfPresent(
      input.customerNotes ?? input.customer_notes
    ),
    cancellationReason: toStringIfPresent(
      input.cancellationReason ?? input.cancellation_reason
    ),
    cancelledAt: toDate(input.cancelledAt ?? input.cancelled_at),
  };

  if (applyDefaults) {
    normalized.bookingType ??= BookingType.test_drive;
    normalized.status ??= BookingStatus.pending;
    normalized.durationMinutes ??= 60;
    normalized.customerName ??= "Customer";
    normalized.customerPhone ??= "N/A";
  }

  return normalized;
};

export const listBookings = async () =>
  prisma.booking.findMany({ orderBy: { scheduledDatetime: "desc" } });

export const createBooking = async (input: Input) => {
  const payload = bookingSchema.parse(
    normalizeBookingPayload(input, { applyDefaults: true })
  );
  return prisma.booking.create({ data: payload });
};

export const updateBooking = async (id: number, input: Input) => {
  const payload = bookingUpdateSchema.parse(
    normalizeBookingPayload(input, { applyDefaults: false })
  );
  return prisma.booking.update({ where: { id }, data: payload });
};
