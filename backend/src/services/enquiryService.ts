import {
  EnquiryPriority,
  EnquiryStatus,
  EnquiryType,
  PreferredContactMethod,
} from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/db.js";

type Input = Record<string, unknown>;

const toBoolean = (value: unknown): boolean | undefined => {
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

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const stringValue = typeof value === "string" ? value : String(value);
  const match = stringValue.match(/-?\d+(\.\d+)?/);
  const parsed = match ? Number(match[0]) : Number(stringValue);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const toStringIfPresent = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  const str = String(value).trim();
  return str.length ? str : undefined;
};

const mapEnquiryType = (value: unknown): EnquiryType | undefined => {
  const normalized = String(value ?? "").toLowerCase();
  switch (normalized) {
    case "vehicle_interest":
    case "vehicle":
    case "interest":
      return EnquiryType.vehicle_interest;
    case "test_drive":
    case "test drive":
      return EnquiryType.test_drive;
    case "finance":
      return EnquiryType.finance;
    case "trade_in":
    case "trade-in":
      return EnquiryType.trade_in;
    case "sell_vehicle":
    case "sell":
      return EnquiryType.sell_vehicle;
    case "general":
      return EnquiryType.general;
    default:
      return undefined;
  }
};

const mapPreferredContact = (
  value: unknown
): PreferredContactMethod | undefined => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "email") return PreferredContactMethod.email;
  if (normalized === "whatsapp") return PreferredContactMethod.whatsapp;
  if (normalized === "phone") return PreferredContactMethod.phone;
  return undefined;
};

const mapEnquiryStatus = (value: unknown): EnquiryStatus | undefined => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "contacted") return EnquiryStatus.contacted;
  if (normalized === "qualified") return EnquiryStatus.qualified;
  if (normalized === "appointment_set") return EnquiryStatus.appointment_set;
  if (normalized === "lost") return EnquiryStatus.lost;
  if (normalized === "closed_won") return EnquiryStatus.closed_won;
  if (normalized === "closed_lost") return EnquiryStatus.closed_lost;
  if (normalized === "new") return EnquiryStatus.new;
  return undefined;
};

const mapEnquiryPriority = (value: unknown): EnquiryPriority | undefined => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "low") return EnquiryPriority.low;
  if (normalized === "high") return EnquiryPriority.high;
  if (normalized === "urgent") return EnquiryPriority.urgent;
  if (normalized === "medium") return EnquiryPriority.medium;
  return undefined;
};

const baseEnquirySchema = z.object({
  enquiryType: z.nativeEnum(EnquiryType).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  message: z.string().optional(),
  hasTradein: z.boolean().optional(),
  tradeInYear: z.coerce.number().int().optional(),
  tradeInMake: z.string().optional(),
  tradeInModel: z.string().optional(),
  tradeInOdometer: z.coerce.number().int().optional(),
  wantsFinance: z.boolean().optional(),
  wantsTestDrive: z.boolean().optional(),
  vehicleId: z.coerce.number().int().optional(),
  vehicleDetails: z.string().optional(),
  vehiclePrice: z.coerce.number().optional(),
  financeEstimate: z.coerce.number().optional(),
  preferredContactMethod: z.nativeEnum(PreferredContactMethod).optional(),
  preferredContactTime: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  referrer: z.string().optional(),
  pageUrl: z.string().optional(),
  status: z.nativeEnum(EnquiryStatus).optional(),
  priority: z.nativeEnum(EnquiryPriority).optional(),
  assignedStaffId: z.coerce.number().int().optional(),
  contactedAt: z.coerce.date().optional(),
  closedAt: z.coerce.date().optional(),
  internalNotes: z.string().optional(),
});

export const enquirySchema = baseEnquirySchema.extend({
  enquiryType: z.nativeEnum(EnquiryType),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const enquiryUpdateSchema = baseEnquirySchema;

const normalizeEnquiryPayload = (
  input: Input,
  { applyDefaults }: { applyDefaults: boolean }
) => {
  const normalized: Record<string, unknown> = {
    enquiryType:
      mapEnquiryType(input.enquiryType) ??
      mapEnquiryType(input.enquiry_type) ??
      undefined,
    firstName:
      toStringIfPresent(input.firstName) ??
      toStringIfPresent(input.first_name) ??
      undefined,
    lastName:
      toStringIfPresent(input.lastName) ??
      toStringIfPresent(input.last_name) ??
      undefined,
    mobile: toStringIfPresent(input.mobile ?? input.phone),
    email: toStringIfPresent(input.email),
    message: toStringIfPresent(input.message),
    hasTradein: toBoolean(input.hasTradein ?? input.has_tradein),
    tradeInYear: toNumber(input.tradeInYear ?? input.trade_in_year),
    tradeInMake: toStringIfPresent(input.tradeInMake ?? input.trade_in_make),
    tradeInModel: toStringIfPresent(input.tradeInModel ?? input.trade_in_model),
    tradeInOdometer: toNumber(
      input.tradeInOdometer ?? input.trade_in_odometer
    ),
    wantsFinance: toBoolean(input.wantsFinance ?? input.wants_finance),
    wantsTestDrive: toBoolean(input.wantsTestDrive ?? input.wants_test_drive),
    vehicleId: toNumber(input.vehicleId ?? input.vehicle_id),
    vehicleDetails: toStringIfPresent(
      input.vehicleDetails ?? input.vehicle_details
    ),
    vehiclePrice: toNumber(input.vehiclePrice ?? input.vehicle_price),
    financeEstimate: toNumber(
      input.financeEstimate ?? input.finance_estimate
    ),
    preferredContactMethod:
      mapPreferredContact(
        input.preferredContactMethod ?? input.preferred_contact_method
      ) ?? undefined,
    preferredContactTime: toStringIfPresent(
      input.preferredContactTime ?? input.preferred_contact_time
    ),
    utmSource: toStringIfPresent(input.utmSource ?? input.utm_source),
    utmMedium: toStringIfPresent(input.utmMedium ?? input.utm_medium),
    utmCampaign: toStringIfPresent(input.utmCampaign ?? input.utm_campaign),
    referrer: toStringIfPresent(input.referrer),
    pageUrl: toStringIfPresent(input.pageUrl ?? input.page_url),
    status:
      mapEnquiryStatus(input.status) ?? mapEnquiryStatus(input.enquiryStatus),
    priority:
      mapEnquiryPriority(input.priority) ??
      mapEnquiryPriority(input.enquiryPriority),
    assignedStaffId: toNumber(
      input.assignedStaffId ?? input.assigned_staff_id
    ),
    contactedAt: toDate(input.contactedAt ?? input.contacted_at),
    closedAt: toDate(input.closedAt ?? input.closed_at),
    internalNotes: toStringIfPresent(
      input.internalNotes ?? input.internal_notes
    ),
  };

  if (applyDefaults) {
    normalized.enquiryType ??= EnquiryType.general;
    normalized.firstName ??= "Customer";
    normalized.lastName ??= "Enquiry";
  }

  return normalized;
};

export const listEnquiries = async () =>
  prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

export const createEnquiry = async (input: Input) => {
  const payload = enquirySchema.parse(
    normalizeEnquiryPayload(input, { applyDefaults: true })
  );
  return prisma.enquiry.create({ data: payload });
};

export const updateEnquiry = async (id: number, input: Input) => {
  const payload = enquiryUpdateSchema.parse(
    normalizeEnquiryPayload(input, { applyDefaults: false })
  );
  return prisma.enquiry.update({ where: { id }, data: payload });
};
