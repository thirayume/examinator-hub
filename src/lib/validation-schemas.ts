import { z } from 'zod';

// User validation schema
export const userSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  first_name: z.string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name must be less than 100 characters" }),
  last_name: z.string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(100, { message: "Last name must be less than 100 characters" }),
  phone: z.string()
    .trim()
    .regex(/^(\+?[0-9]{10,15})?$/, { message: "Invalid phone number format" })
    .optional()
    .or(z.literal('')),
  role: z.enum(['admin', 'staff', 'student'], { 
    errorMap: () => ({ message: "Invalid role" })
  })
});

export const userUpdateSchema = userSchema.omit({ email: true });

// Venue validation schema
export const venueSchema = z.object({
  name: z.string()
    .min(1, { message: "Venue name is required" })
    .max(200, { message: "Venue name must be less than 200 characters" })
    .transform(v => v.trim()),
  address: z.string()
    .min(1, { message: "Address is required" })
    .max(500, { message: "Address must be less than 500 characters" })
    .transform(v => v.trim()),
  capacity: z.number()
    .int({ message: "Capacity must be a whole number" })
    .min(1, { message: "Capacity must be at least 1" })
    .max(100000, { message: "Capacity must be less than 100,000" }),
  is_active: z.boolean()
});

// Website settings validation schema
export const websiteSettingsSchema = z.object({
  institute_name: z.string()
    .trim()
    .min(1, { message: "Institute name is required" })
    .max(200, { message: "Institute name must be less than 200 characters" }),
  hero_title: z.string()
    .trim()
    .min(1, { message: "Hero title is required" })
    .max(300, { message: "Hero title must be less than 300 characters" }),
  hero_subtitle: z.string()
    .trim()
    .max(1000, { message: "Hero subtitle must be less than 1000 characters" })
    .optional()
    .or(z.literal(''))
});

// Type exports
export type UserFormData = z.infer<typeof userSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type VenueFormData = z.infer<typeof venueSchema>;
export type WebsiteSettingsFormData = z.infer<typeof websiteSettingsSchema>;
