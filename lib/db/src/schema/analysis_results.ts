import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const analysisResultsTable = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  case_id: integer("case_id").notNull(),
  skill_id: text("skill_id"),
  skill_name: text("skill_name"),
  workflow_type: text("workflow_type"),
  analise: text("analise").notNull(),
  fundamentacao_juridica: text("fundamentacao_juridica").notNull(),
  jurisprudencia_nivel1: text("jurisprudencia_nivel1").notNull(),
  jurisprudencia_nivel2: text("jurisprudencia_nivel2").notNull(),
  jurisprudencia_nivel3: text("jurisprudencia_nivel3").notNull(),
  decisao_recomendacao: text("decisao_recomendacao").notNull(),
  status: text("status").notNull().default("Concluído"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResultsTable).omit({
  id: true,
  created_at: true,
});
export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResultsTable.$inferSelect;
