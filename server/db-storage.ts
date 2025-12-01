import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Complaint,
  type InsertComplaint,
  type ComplaintNote,
  type InsertComplaintNote,
  users,
  complaints,
  complaintNotes,
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import pgSimple from "connect-pg-simple";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getComplaints(): Promise<Complaint[]>;
  getComplaintsByUserId(userId: string): Promise<Complaint[]>;
  getComplaintsByDepartment(department: string): Promise<Complaint[]>;
  getComplaintById(id: string): Promise<Complaint | undefined>;
  getComplaintByComplaintId(complaintId: string): Promise<Complaint | undefined>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaintStatus(id: string, status: string): Promise<Complaint | undefined>;

  getNotesByComplaintId(complaintId: string): Promise<ComplaintNote[]>;
  createNote(note: InsertComplaintNote): Promise<ComplaintNote>;

  sessionStore: session.Store;
}

export class DrizzleStorage implements IStorage {
  private db: any;
  private complaintCounter: number = 0;
  sessionStore: session.Store;

  constructor(db: any, sessionStore: session.Store) {
    this.db = db;
    this.sessionStore = sessionStore;
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    return result[0];
  }

  async getComplaints(): Promise<Complaint[]> {
    const result = await this.db
      .select()
      .from(complaints)
      .orderBy((t: any) => t.createdAt ? new Date(t.createdAt).getTime() : 0);
    return result.sort((a, b) => {
      const timeA = new Date(b.createdAt).getTime();
      const timeB = new Date(a.createdAt).getTime();
      return timeA - timeB;
    });
  }

  async getComplaintsByUserId(userId: string): Promise<Complaint[]> {
    const result = await this.db
      .select()
      .from(complaints)
      .where(eq(complaints.citizenId, userId));
    return result.sort((a, b) => {
      const timeA = new Date(b.createdAt).getTime();
      const timeB = new Date(a.createdAt).getTime();
      return timeA - timeB;
    });
  }

  async getComplaintsByDepartment(department: string): Promise<Complaint[]> {
    const result = await this.db
      .select()
      .from(complaints)
      .where(eq(complaints.category, department));
    return result.sort((a, b) => {
      const timeA = new Date(b.createdAt).getTime();
      const timeB = new Date(a.createdAt).getTime();
      return timeA - timeB;
    });
  }

  async getComplaintById(id: string): Promise<Complaint | undefined> {
    const result = await this.db
      .select()
      .from(complaints)
      .where(eq(complaints.id, id))
      .limit(1);
    return result[0];
  }

  async getComplaintByComplaintId(complaintId: string): Promise<Complaint | undefined> {
    const result = await this.db
      .select()
      .from(complaints)
      .where(eq(complaints.complaintId, complaintId.toUpperCase()))
      .limit(1);
    return result[0];
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const year = new Date().getFullYear();
    
    // Get max counter from database
    const maxComplaint = await this.db
      .select()
      .from(complaints)
      .orderBy((t: any) => t.complaintId)
      .limit(1);

    let counter = 1;
    if (maxComplaint.length > 0) {
      const lastId = maxComplaint[0].complaintId;
      const match = lastId.match(/GRP-\d+-(\d+)/);
      if (match) {
        counter = parseInt(match[1]) + 1;
      }
    }

    const complaintId = `GRP-${year}-${String(counter).padStart(4, "0")}`;

    const result = await this.db
      .insert(complaints)
      .values({
        ...insertComplaint,
        complaintId,
        status: "submitted",
      })
      .returning();

    return result[0];
  }

  async updateComplaintStatus(id: string, status: string): Promise<Complaint | undefined> {
    const result = await this.db
      .update(complaints)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(complaints.id, id))
      .returning();
    return result[0];
  }

  async getNotesByComplaintId(complaintId: string): Promise<ComplaintNote[]> {
    const result = await this.db
      .select()
      .from(complaintNotes)
      .where(eq(complaintNotes.complaintId, complaintId));
    return result.sort((a, b) => {
      const timeA = new Date(b.createdAt).getTime();
      const timeB = new Date(a.createdAt).getTime();
      return timeA - timeB;
    });
  }

  async createNote(insertNote: InsertComplaintNote): Promise<ComplaintNote> {
    const result = await this.db
      .insert(complaintNotes)
      .values(insertNote)
      .returning();
    return result[0];
  }
}

export async function initializeStorage(): Promise<IStorage> {
  if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
    // Production: Use Drizzle + PostgreSQL
    const db = drizzle(process.env.DATABASE_URL);
    const PgSession = pgSimple(session);
    
    const sessionStore = new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "session",
    });

    return new DrizzleStorage(db, sessionStore);
  } else {
    // Development: Use in-memory storage
    const { MemStorage } = await import("./storage");
    return new MemStorage();
  }
}
