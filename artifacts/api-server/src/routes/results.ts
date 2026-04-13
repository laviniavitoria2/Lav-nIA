import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, analysisResultsTable } from "@workspace/db";
import {
  GetResultParams,
  DeleteResultParams,
  ListResultsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/results", async (req, res): Promise<void> => {
  const queryParams = ListResultsQueryParams.safeParse(req.query);
  const caseId = queryParams.success ? queryParams.data.caseId : undefined;

  const query = db
    .select()
    .from(analysisResultsTable)
    .orderBy(desc(analysisResultsTable.created_at));

  const results = caseId
    ? await query.where(eq(analysisResultsTable.case_id, caseId))
    : await query;

  res.json(results);
});

router.get("/results/:id", async (req, res): Promise<void> => {
  const params = GetResultParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [result] = await db
    .select()
    .from(analysisResultsTable)
    .where(eq(analysisResultsTable.id, params.data.id));

  if (!result) {
    res.status(404).json({ error: "Result not found" });
    return;
  }

  res.json(result);
});

router.delete("/results/:id", async (req, res): Promise<void> => {
  const params = DeleteResultParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(analysisResultsTable)
    .where(eq(analysisResultsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Result not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
