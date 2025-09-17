import { z } from "zod";

// Company schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(100, "Company name too long"),
  sector: z.string().min(1, "Sector is required").max(50, "Sector name too long"),
  targetRaise: z.number().positive("Target raise must be positive").max(1000000000, "Target raise too large"),
  revenue: z.number().min(0, "Revenue cannot be negative").max(1000000000, "Revenue too large"),
});

export const updateCompanySchema = createCompanySchema.partial();

// Financial schemas
export const linkFinancialsSchema = z.object({
  token: z.string().min(1, "Plaid token is required"),
  institutionName: z.string().optional(),
});

// File upload schemas
export const uploadFileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  size: z.number().positive("File size must be positive").max(10 * 1024 * 1024, "File too large (max 10MB)"),
});

// KYC schemas
export const kycVerifySchema = z.object({
  inquiryId: z.string().min(1, "Inquiry ID is required"),
  documentType: z.enum(["drivers_license", "passport", "national_id"]).optional(),
});

// Message schemas
export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required").max(1000, "Message too long"),
  sender: z.enum(["user", "support"]),
});

// Notification schemas
export const createNotificationSchema = z.object({
  message: z.string().min(1, "Notification message is required").max(200, "Message too long"),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
});

// Score calculation schema
export const calculateScoreSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Email validation schema
export const emailSchema = z.object({
  email: z.string().email("Valid email is required"),
});

// ID validation schema
export const idSchema = z.object({
  id: z.string().min(1, "ID is required"),
});
