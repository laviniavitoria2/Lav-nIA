import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const legalCasesTable = pgTable("legal_cases", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  fatos: text("fatos").notNull(),
  partes: text("partes").notNull(),
  problema: text("problema").notNull(),
  objetivo: text("objetivo").notNull(),
  documentos: text("documentos"),
  status: text("status").notNull().default("Pendente"),
  tipo: text("tipo"),
  numero_processo: text("numero_processo"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLegalCaseSchema = createInsertSchema(legalCasesTable).omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type InsertLegalCase = z.infer<typeof insertLegalCaseSchema>;
export type LegalCase = typeof legalCasesTable.$inferSelect;
