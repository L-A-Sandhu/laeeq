import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  journal: text("journal").notNull(),
  year: integer("year").notNull(),
  volume: text("volume"),
  pages: text("pages"),
  doi: text("doi"),
  pdfPath: text("pdf_path"),
  type: text("type").notNull(), // 'journal' or 'conference'
  isFirstAuthor: boolean("is_first_author").default(false),
  citations: integer("citations").default(0),
});

export const citations = pgTable("citations", {
  id: serial("id").primaryKey(),
  totalCitations: integer("total_citations").notNull(),
  lastUpdated: text("last_updated").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPublicationSchema = createInsertSchema(publications);
export const insertCitationSchema = createInsertSchema(citations);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type Citation = typeof citations.$inferSelect;
export type InsertCitation = z.infer<typeof insertCitationSchema>;
