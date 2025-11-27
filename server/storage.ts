import {
  type User,
  type InsertUser,
  type Complaint,
  type InsertComplaint,
  type ComplaintNote,
  type InsertComplaintNote,
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private complaints: Map<string, Complaint>;
  private notes: Map<string, ComplaintNote>;
  private complaintCounter: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.complaints = new Map();
    this.notes = new Map();
    this.complaintCounter = 0;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name,
      email: insertUser.email,
      phone: insertUser.phone,
      address: insertUser.address,
      role: insertUser.role || "citizen",
      department: insertUser.department ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getComplaints(): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getComplaintsByUserId(userId: string): Promise<Complaint[]> {
    return Array.from(this.complaints.values())
      .filter((c) => c.citizenId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getComplaintsByDepartment(department: string): Promise<Complaint[]> {
    return Array.from(this.complaints.values())
      .filter((c) => c.category === department)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getComplaintById(id: string): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }

  async getComplaintByComplaintId(complaintId: string): Promise<Complaint | undefined> {
    return Array.from(this.complaints.values()).find(
      (c) => c.complaintId.toUpperCase() === complaintId.toUpperCase()
    );
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    this.complaintCounter++;
    const year = new Date().getFullYear();
    const complaintId = `GRP-${year}-${String(this.complaintCounter).padStart(4, "0")}`;
    const now = new Date();

    const complaint: Complaint = {
      ...insertComplaint,
      id,
      complaintId,
      status: "submitted",
      createdAt: now,
      updatedAt: now,
    };
    this.complaints.set(id, complaint);
    return complaint;
  }

  async updateComplaintStatus(id: string, status: string): Promise<Complaint | undefined> {
    const complaint = this.complaints.get(id);
    if (!complaint) return undefined;

    const updated: Complaint = {
      ...complaint,
      status,
      updatedAt: new Date(),
    };
    this.complaints.set(id, updated);
    return updated;
  }

  async getNotesByComplaintId(complaintId: string): Promise<ComplaintNote[]> {
    return Array.from(this.notes.values())
      .filter((n) => n.complaintId === complaintId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNote(insertNote: InsertComplaintNote): Promise<ComplaintNote> {
    const id = randomUUID();
    const note: ComplaintNote = {
      ...insertNote,
      id,
      createdAt: new Date(),
    };
    this.notes.set(id, note);
    return note;
  }
}

export const storage = new MemStorage();
