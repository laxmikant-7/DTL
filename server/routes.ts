import type { Express } from "express";
import { createServer, type Server } from "http";
import { type IStorage } from "./db-storage";
import { setupAuth } from "./auth";
import { complaintFormSchema, complaintStatuses } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
  storage?: IStorage
): Promise<Server> {
  if (!storage) {
    throw new Error("Storage is required");
  }
  setupAuth(app, storage);

  app.get("/api/complaints", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const complaints = await storage.getComplaintsByUserId(req.user!.id);
      res.json(complaints);
    } catch (err) {
      res.status(500).send("Failed to fetch complaints");
    }
  });

  app.post("/api/complaints", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const validatedData = complaintFormSchema.parse(req.body);

      const complaint = await storage.createComplaint({
        ...validatedData,
        citizenId: req.user!.id,
        status: "submitted",
      });

      res.status(201).json(complaint);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      res.status(500).send("Failed to create complaint");
    }
  });

  app.get("/api/complaints/track/:complaintId", async (req, res) => {
    try {
      const complaint = await storage.getComplaintByComplaintId(req.params.complaintId);
      if (!complaint) {
        return res.status(404).send("Complaint not found");
      }
      res.json(complaint);
    } catch (err) {
      res.status(500).send("Failed to fetch complaint");
    }
  });

  app.get("/api/complaints/:id/notes", async (req, res) => {
    try {
      const notes = await storage.getNotesByComplaintId(req.params.id);
      res.json(notes);
    } catch (err) {
      res.status(500).send("Failed to fetch notes");
    }
  });

  app.get("/api/officer/complaints", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    if (req.user!.role !== "officer") {
      return res.status(403).send("Access denied. Officers only.");
    }

    try {
      const department = req.user!.department;
      let complaints;

      if (department) {
        complaints = await storage.getComplaintsByDepartment(department);
      } else {
        complaints = await storage.getComplaints();
      }

      res.json(complaints);
    } catch (err) {
      res.status(500).send("Failed to fetch complaints");
    }
  });

  app.patch("/api/complaints/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    if (req.user!.role !== "officer") {
      return res.status(403).send("Access denied. Officers only.");
    }

    try {
      const { status } = req.body;

      if (!complaintStatuses.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      const complaint = await storage.updateComplaintStatus(req.params.id, status);
      if (!complaint) {
        return res.status(404).send("Complaint not found");
      }

      res.json(complaint);
    } catch (err) {
      res.status(500).send("Failed to update status");
    }
  });

  app.post("/api/complaints/:id/notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    if (req.user!.role !== "officer") {
      return res.status(403).send("Access denied. Officers only.");
    }

    try {
      const { note } = req.body;

      if (!note || note.length < 5) {
        return res.status(400).send("Note must be at least 5 characters");
      }

      const complaint = await storage.getComplaintById(req.params.id);
      if (!complaint) {
        return res.status(404).send("Complaint not found");
      }

      const newNote = await storage.createNote({
        complaintId: req.params.id,
        officerId: req.user!.id,
        officerName: req.user!.name,
        note,
      });

      res.status(201).json(newNote);
    } catch (err) {
      res.status(500).send("Failed to add note");
    }
  });

  return httpServer;
}
