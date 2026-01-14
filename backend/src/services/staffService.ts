import { StaffRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/db.js";

type Input = Record<string, unknown>;

const toStringIfPresent = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  const str = String(value).trim();
  return str.length ? str : undefined;
};

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

const mapRole = (value: unknown): StaffRole | undefined => {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  if (normalized === "SALES") return StaffRole.SALES;
  if (normalized === "FINANCE") return StaffRole.FINANCE;
  if (normalized === "MANAGER") return StaffRole.MANAGER;
  if (normalized === "SERVICE_ADVISOR") return StaffRole.SERVICE_ADVISOR;
  return undefined;
};

const staffSchemaBase = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(StaffRole).optional(),
  isActive: z.boolean().optional(),
});

export const staffSchema = staffSchemaBase.extend({
  fullName: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(StaffRole),
});

export const staffUpdateSchema = staffSchemaBase;

const normalizeStaffPayload = (
  input: Input,
  { applyDefaults }: { applyDefaults: boolean }
) => {
  const normalized: Record<string, unknown> = {
    fullName:
      toStringIfPresent(input.fullName ?? input.full_name) ?? undefined,
    email: toStringIfPresent(input.email),
    phone: toStringIfPresent(input.phone),
    role:
      mapRole(input.role) ??
      mapRole(input.staffRole) ??
      mapRole(input.position) ??
      undefined,
    isActive: toBoolean(input.isActive ?? input.is_active),
  };

  if (applyDefaults) {
    normalized.isActive ??= true;
  }

  return normalized;
};

export const listStaff = async () =>
  prisma.staff.findMany({ orderBy: { createdAt: "desc" } });

export const createStaff = async (input: Input) => {
  const payload = staffSchema.parse(
    normalizeStaffPayload(input, { applyDefaults: true })
  );
  return prisma.staff.create({ data: payload });
};

export const updateStaff = async (id: number, input: Input) => {
  const payload = staffUpdateSchema.parse(
    normalizeStaffPayload(input, { applyDefaults: false })
  );
  return prisma.staff.update({ where: { id }, data: payload });
};
