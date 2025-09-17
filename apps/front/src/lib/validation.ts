import { z } from "zod";

// Company validation schemas
export const createCompanySchema = z.object({
  name: z.string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s&.-]+$/, "Company name contains invalid characters"),
  
  sector: z.string()
    .min(1, "Sector is required")
    .max(50, "Sector must be less than 50 characters"),
  
  targetRaise: z.number()
    .positive("Target raise must be positive")
    .min(10000, "Minimum target raise is $10,000")
    .max(1000000000, "Maximum target raise is $1B"),
  
  revenue: z.number()
    .min(0, "Revenue cannot be negative")
    .max(1000000000, "Maximum revenue is $1B"),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

// Email authentication schema
export const emailAuthSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(254, "Email is too long"),
});

export type EmailAuthInput = z.infer<typeof emailAuthSchema>;

// File upload validation schema
export const fileUploadSchema = z.object({
  name: z.string()
    .min(1, "File name is required")
    .max(255, "File name is too long"),
  
  size: z.number()
    .positive("File size must be positive")
    .max(10 * 1024 * 1024, "File size cannot exceed 10MB"),
  
  type: z.string()
    .min(1, "File type is required")
    .refine(
      (type) => [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint'
      ].includes(type),
      "Only PDF, Excel, and PowerPoint files are allowed"
    ),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// Message validation schema
export const messageSchema = z.object({
  content: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters")
    .trim(),
});

export type MessageInput = z.infer<typeof messageSchema>;

// KYC verification schema
export const kycVerifySchema = z.object({
  inquiryId: z.string()
    .min(1, "Inquiry ID is required"),
  
  documentType: z.enum(["drivers_license", "passport", "national_id"])
    .optional(),
});

export type KycVerifyInput = z.infer<typeof kycVerifySchema>;

// Financial linking schema
export const linkFinancialsSchema = z.object({
  token: z.string()
    .min(1, "Plaid token is required"),
  
  institutionName: z.string()
    .min(1, "Institution name is required")
    .max(100, "Institution name is too long")
    .optional(),
});

export type LinkFinancialsInput = z.infer<typeof linkFinancialsSchema>;

// Form validation helpers
export const validateRequired = (value: string, fieldName: string) => {
  if (!value?.trim()) {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
};

export const validateEmail = (email: string) => {
  const result = emailAuthSchema.safeParse({ email });
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data.email;
};

export const validateFileSize = (size: number) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (size > maxSize) {
    throw new Error("File size cannot exceed 10MB");
  }
  return true;
};

export const validateFileType = (type: string, allowedTypes: string[]) => {
  if (!allowedTypes.includes(type)) {
    throw new Error(`File type ${type} is not allowed`);
  }
  return true;
};