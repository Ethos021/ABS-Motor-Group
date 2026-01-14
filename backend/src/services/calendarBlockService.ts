import { BlockType, RecurrencePattern } from "@prisma/client";
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

const mapBlockType = (value: unknown): BlockType | undefined => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "holiday") return BlockType.holiday;
  if (normalized === "meeting") return BlockType.meeting;
  if (normalized === "maintenance") return BlockType.maintenance;
  if (normalized === "training") return BlockType.training;
  if (normalized === "other") return BlockType.other;
  return undefined;
};

const mapRecurrence = (
  value: unknown
): RecurrencePattern | undefined => {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "daily") return RecurrencePattern.daily;
  if (normalized === "weekly") return RecurrencePattern.weekly;
  if (normalized === "monthly") return RecurrencePattern.monthly;
  if (normalized === "yearly") return RecurrencePattern.yearly;
  return undefined;
};

const baseBlockSchema = z.object({
  title: z.string().min(1).optional(),
  startDatetime: z.coerce.date().optional(),
  endDatetime: z.coerce.date().optional(),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.nativeEnum(RecurrencePattern).optional(),
  recurrenceEndDate: z.coerce.date().optional(),
  blockType: z.nativeEnum(BlockType).optional(),
  staffId: z.coerce.number().int().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const calendarBlockSchema = baseBlockSchema.extend({
  title: z.string().min(1),
  startDatetime: z.coerce.date(),
  endDatetime: z.coerce.date(),
  blockType: z.nativeEnum(BlockType),
});

export const calendarBlockUpdateSchema = baseBlockSchema;

const normalizeBlockPayload = (
  input: Input,
  { applyDefaults }: { applyDefaults: boolean }
) => {
  const normalized: Record<string, unknown> = {
    title: toStringIfPresent(input.title),
    startDatetime:
      toDate(input.startDatetime ?? input.start_datetime) ?? undefined,
    endDatetime: toDate(input.endDatetime ?? input.end_datetime) ?? undefined,
    isRecurring: toBoolean(input.isRecurring ?? input.is_recurring),
    recurrencePattern:
      mapRecurrence(input.recurrencePattern ?? input.recurrence_pattern) ??
      undefined,
    recurrenceEndDate: toDate(
      input.recurrenceEndDate ?? input.recurrence_end_date
    ),
    blockType:
      mapBlockType(input.blockType ?? input.block_type) ??
      undefined,
    staffId: toNumber(input.staffId ?? input.staff_id),
    notes: toStringIfPresent(input.notes),
    isActive: toBoolean(input.isActive ?? input.is_active),
  };

  if (applyDefaults) {
    normalized.blockType ??= BlockType.holiday;
    normalized.isActive ??= true;
    normalized.isRecurring ??= false;
  }

  return normalized;
};

export const listCalendarBlocks = async () =>
  prisma.calendarBlock.findMany({ orderBy: { startDatetime: "desc" } });

export const createCalendarBlock = async (input: Input) => {
  const payload = calendarBlockSchema.parse(
    normalizeBlockPayload(input, { applyDefaults: true })
  );
  return prisma.calendarBlock.create({ data: payload });
};

export const updateCalendarBlock = async (id: number, input: Input) => {
  const payload = calendarBlockUpdateSchema.parse(
    normalizeBlockPayload(input, { applyDefaults: false })
  );
  return prisma.calendarBlock.update({ where: { id }, data: payload });
};

export const deleteCalendarBlock = async (id: number) =>
  prisma.calendarBlock.delete({ where: { id } });
