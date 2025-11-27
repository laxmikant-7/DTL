import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles: "citizen" or "officer"
// Officers have a department assignment

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  role: text("role").notNull().default("citizen"), // "citizen" or "officer"
  department: text("department"), // For officers: "electricity", "water", "roads", "waste", "other"
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Complaint categories
export const complaintCategories = ["electricity", "water", "roads", "waste", "other"] as const;
export type ComplaintCategory = typeof complaintCategories[number];

// Complaint statuses
export const complaintStatuses = ["submitted", "in_progress", "resolved"] as const;
export type ComplaintStatus = typeof complaintStatuses[number];

export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintId: text("complaint_id").notNull().unique(), // Human-readable ID like "GRP-2024-001"
  citizenId: varchar("citizen_id").notNull(),
  category: text("category").notNull(), // electricity, water, roads, waste, other
  location: text("location").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("submitted"), // submitted, in_progress, resolved
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  complaintId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;

// Notes added by officers to complaints
export const complaintNotes = pgTable("complaint_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintId: varchar("complaint_id").notNull(),
  officerId: varchar("officer_id").notNull(),
  officerName: text("officer_name").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertComplaintNoteSchema = createInsertSchema(complaintNotes).omit({
  id: true,
  createdAt: true,
});

export type InsertComplaintNote = z.infer<typeof insertComplaintNoteSchema>;
export type ComplaintNote = typeof complaintNotes.$inferSelect;

// Validation schemas for forms
export const citizenRegistrationSchema = insertUserSchema
  .omit({ role: true, department: true })
  .extend({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const complaintFormSchema = z.object({
  category: z.enum(complaintCategories, { required_error: "Please select a category" }),
  location: z.string().min(5, "Location must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

export type CitizenRegistration = z.infer<typeof citizenRegistrationSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ComplaintFormData = z.infer<typeof complaintFormSchema>;
