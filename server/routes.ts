import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all publications
  app.get("/api/publications", async (req, res) => {
    try {
      const publications = await storage.getAllPublications();
      res.json(publications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch publications" });
    }
  });

  // Get publications by type
  app.get("/api/publications/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const publications = await storage.getPublicationsByType(type);
      res.json(publications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch publications" });
    }
  });

  // Get current citations
  app.get("/api/citations", async (req, res) => {
    try {
      const citations = await storage.getCurrentCitations();
      res.json(citations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch citations" });
    }
  });

  // Update citations (for Google Scholar integration)
  app.post("/api/citations", async (req, res) => {
    try {
      const { totalCitations } = req.body;
      const updatedCitations = await storage.updateCitations({
        totalCitations,
        lastUpdated: new Date().toISOString(),
      });
      res.json(updatedCitations);
    } catch (error) {
      res.status(500).json({ error: "Failed to update citations" });
    }
  });

  // Google Scholar webhook endpoint
  app.post("/api/scholar/webhook", async (req, res) => {
    try {
      const { citations } = req.body;
      const updatedCitations = await storage.updateCitations({
        totalCitations: citations,
        lastUpdated: new Date().toISOString(),
      });
      res.json({ success: true, citations: updatedCitations });
    } catch (error) {
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  // Google Scholar real-time citation fetch endpoint
  app.get("/api/scholar/citations/:userId", async (req, res) => {
    try {
      // This would integrate with a real Google Scholar API or scraping service
      // For now, return current data with simulated update
      const current = await storage.getCurrentCitations();
      const simulatedUpdate = {
        totalCitations: current?.totalCitations || 27,
        hIndex: 3,
        i10Index: 2,
        lastUpdated: new Date().toISOString(),
      };
      res.json(simulatedUpdate);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Google Scholar data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
