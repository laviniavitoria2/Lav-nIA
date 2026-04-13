import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, legalCasesTable, analysisResultsTable } from "@workspace/db";
import {
  CreateCaseBody,
  UpdateCaseBody,
  GetCaseParams,
  UpdateCaseParams,
  DeleteCaseParams,
  AnalyzeCaseParams,
  AnalyzeCaseBody,
  RunWorkflowParams,
  RunWorkflowBody,
  ListCasesQueryParams,
} from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { LEGAL_SKILLS, WORKFLOW_PROMPTS } from "../lib/legal-skills.js";

const router: IRouter = Router();

router.get("/cases", async (req, res): Promise<void> => {
  const queryParams = ListCasesQueryParams.safeParse(req.query);
  const limit = queryParams.success && queryParams.data.limit ? queryParams.data.limit : 50;
  const offset = queryParams.success && queryParams.data.offset ? queryParams.data.offset : 0;

  const cases = await db
    .select()
    .from(legalCasesTable)
    .orderBy(desc(legalCasesTable.created_at))
    .limit(limit)
    .offset(offset);

  res.json(cases);
});

router.post("/cases", async (req, res): Promise<void> => {
  const parsed = CreateCaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [newCase] = await db
    .insert(legalCasesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(newCase);
});

router.get("/cases/:id", async (req, res): Promise<void> => {
  const params = GetCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [legalCase] = await db
    .select()
    .from(legalCasesTable)
    .where(eq(legalCasesTable.id, params.data.id));

  if (!legalCase) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  res.json(legalCase);
});

router.patch("/cases/:id", async (req, res): Promise<void> => {
  const params = UpdateCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(legalCasesTable)
    .set({ ...parsed.data, updated_at: new Date() })
    .where(eq(legalCasesTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  res.json(updated);
});

router.delete("/cases/:id", async (req, res): Promise<void> => {
  const params = DeleteCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(legalCasesTable)
    .where(eq(legalCasesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/cases/:id/analyze", async (req, res): Promise<void> => {
  const params = AnalyzeCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = AnalyzeCaseBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [legalCase] = await db
    .select()
    .from(legalCasesTable)
    .where(eq(legalCasesTable.id, params.data.id));

  if (!legalCase) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const skill = LEGAL_SKILLS.find(s => s.id === body.data.skill_id);

  const systemPrompt = `Você é um assistente jurídico especializado atuando como operador da habilidade jurídica: "${body.data.skill_name}".
  
${skill ? `Descrição da habilidade: ${skill.description}` : ""}
${body.data.additional_context ? `Contexto adicional fornecido: ${body.data.additional_context}` : ""}

Analise o caso jurídico apresentado e forneça uma análise estruturada em formato JSON com os seguintes campos EXATOS:
{
  "analise": "Análise completa e fundamentada do caso sob a perspectiva desta habilidade jurídica específica",
  "fundamentacao_juridica": "Base legal, doutrina e normas jurídicas aplicáveis. Cite artigos de lei, doutrina e conceitos jurídicos relevantes.",
  "jurisprudencia_nivel1": "NÍVEL 1 - Precedentes do STF (Supremo Tribunal Federal) aplicáveis ao caso. Inclua súmulas, ADIs, ADCs e repercussões gerais relevantes.",
  "jurisprudencia_nivel2": "NÍVEL 2 - Precedentes do STJ (Superior Tribunal de Justiça) aplicáveis. Inclua REsps, recursos repetitivos e súmulas do STJ.",
  "jurisprudencia_nivel3": "NÍVEL 3 - Jurisprudência dos Tribunais Regionais e Estaduais aplicável. Inclua TRFs, TJs e seus posicionamentos sobre o tema.",
  "decisao_recomendacao": "Decisão ou recomendação final baseada na análise, com fundamento jurídico claro e objetividade técnica."
}

Responda APENAS com o JSON válido, sem markdown ou texto adicional.`;

  const caseContext = `
CASO JURÍDICO:
Título: ${legalCase.titulo}
${legalCase.numero_processo ? `Número do Processo: ${legalCase.numero_processo}` : ""}
${legalCase.tipo ? `Tipo: ${legalCase.tipo}` : ""}

FATOS:
${legalCase.fatos}

PARTES:
${legalCase.partes}

PROBLEMA:
${legalCase.problema}

OBJETIVO:
${legalCase.objetivo}

${legalCase.documentos ? `DOCUMENTOS:\n${legalCase.documentos}` : ""}
`.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: caseContext }
    ],
  });

  const responseText = completion.choices[0]?.message?.content ?? "{}";
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    parsed = {
      analise: responseText,
      fundamentacao_juridica: "Não foi possível estruturar a fundamentação jurídica automaticamente.",
      jurisprudencia_nivel1: "Consultar jurisprudência do STF manualmente.",
      jurisprudencia_nivel2: "Consultar jurisprudência do STJ manualmente.",
      jurisprudencia_nivel3: "Consultar jurisprudência dos tribunais regionais manualmente.",
      decisao_recomendacao: "Análise requer revisão manual."
    };
  }

  const [result] = await db
    .insert(analysisResultsTable)
    .values({
      case_id: params.data.id,
      skill_id: body.data.skill_id,
      skill_name: body.data.skill_name,
      workflow_type: null,
      analise: parsed.analise ?? "",
      fundamentacao_juridica: parsed.fundamentacao_juridica ?? "",
      jurisprudencia_nivel1: parsed.jurisprudencia_nivel1 ?? "",
      jurisprudencia_nivel2: parsed.jurisprudencia_nivel2 ?? "",
      jurisprudencia_nivel3: parsed.jurisprudencia_nivel3 ?? "",
      decisao_recomendacao: parsed.decisao_recomendacao ?? "",
      status: "Concluído",
    })
    .returning();

  await db
    .update(legalCasesTable)
    .set({ status: "Em Análise", updated_at: new Date() })
    .where(eq(legalCasesTable.id, params.data.id));

  res.json(result);
});

router.post("/cases/:id/workflow", async (req, res): Promise<void> => {
  const params = RunWorkflowParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = RunWorkflowBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [legalCase] = await db
    .select()
    .from(legalCasesTable)
    .where(eq(legalCasesTable.id, params.data.id));

  if (!legalCase) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const workflowPrompt = WORKFLOW_PROMPTS[body.data.workflow_type];
  if (!workflowPrompt) {
    res.status(400).json({ error: "Invalid workflow type" });
    return;
  }

  const workflowLabels: Record<string, string> = {
    sentenca_civel: "Sentença Cível",
    saneamento: "Saneamento",
    despacho: "Despacho",
    conciliacao: "Conciliação"
  };

  const systemPrompt = `${workflowPrompt}

${body.data.additional_context ? `Contexto adicional: ${body.data.additional_context}` : ""}

Forneça o resultado em formato JSON com os seguintes campos EXATOS:
{
  "analise": "Análise completa do caso para fins do fluxo executado",
  "fundamentacao_juridica": "Base legal, doutrina e normas jurídicas aplicáveis ao fluxo. Cite artigos de lei e conceitos jurídicos relevantes.",
  "jurisprudencia_nivel1": "NÍVEL 1 - Precedentes do STF aplicáveis. Inclua súmulas e repercussões gerais relevantes.",
  "jurisprudencia_nivel2": "NÍVEL 2 - Precedentes do STJ aplicáveis. Inclua REsps e súmulas do STJ.",
  "jurisprudencia_nivel3": "NÍVEL 3 - Jurisprudência dos Tribunais Regionais e Estaduais aplicável.",
  "decisao_recomendacao": "Resultado final do fluxo executado - sentença, decisão interlocutória, despacho ou proposta de acordo completa e detalhada."
}

Responda APENAS com o JSON válido, sem markdown ou texto adicional.`;

  const caseContext = `
CASO JURÍDICO:
Título: ${legalCase.titulo}
${legalCase.numero_processo ? `Número do Processo: ${legalCase.numero_processo}` : ""}
${legalCase.tipo ? `Tipo: ${legalCase.tipo}` : ""}

FATOS:
${legalCase.fatos}

PARTES:
${legalCase.partes}

PROBLEMA:
${legalCase.problema}

OBJETIVO:
${legalCase.objetivo}

${legalCase.documentos ? `DOCUMENTOS:\n${legalCase.documentos}` : ""}
`.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: caseContext }
    ],
  });

  const responseText = completion.choices[0]?.message?.content ?? "{}";
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    parsed = {
      analise: responseText,
      fundamentacao_juridica: "Consultar fundamentação jurídica manualmente.",
      jurisprudencia_nivel1: "Consultar jurisprudência do STF manualmente.",
      jurisprudencia_nivel2: "Consultar jurisprudência do STJ manualmente.",
      jurisprudencia_nivel3: "Consultar jurisprudência dos tribunais regionais manualmente.",
      decisao_recomendacao: "Análise requer revisão manual."
    };
  }

  const [result] = await db
    .insert(analysisResultsTable)
    .values({
      case_id: params.data.id,
      skill_id: null,
      skill_name: null,
      workflow_type: workflowLabels[body.data.workflow_type] ?? body.data.workflow_type,
      analise: parsed.analise ?? "",
      fundamentacao_juridica: parsed.fundamentacao_juridica ?? "",
      jurisprudencia_nivel1: parsed.jurisprudencia_nivel1 ?? "",
      jurisprudencia_nivel2: parsed.jurisprudencia_nivel2 ?? "",
      jurisprudencia_nivel3: parsed.jurisprudencia_nivel3 ?? "",
      decisao_recomendacao: parsed.decisao_recomendacao ?? "",
      status: "Concluído",
    })
    .returning();

  await db
    .update(legalCasesTable)
    .set({ status: "Em Análise", updated_at: new Date() })
    .where(eq(legalCasesTable.id, params.data.id));

  res.json(result);
});

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const allCases = await db.select().from(legalCasesTable);
  const allResults = await db.select().from(analysisResultsTable).orderBy(desc(analysisResultsTable.created_at)).limit(10);

  const total = allCases.length;
  const active = allCases.filter(c => c.status === "Em Análise").length;
  const pending = allCases.filter(c => c.status === "Pendente").length;
  const completed = allResults.length;
  const workflows = allResults.filter(r => r.workflow_type !== null).length;

  // Cases by type
  const typeMap: Record<string, number> = {};
  for (const c of allCases) {
    const tipo = c.tipo ?? "Sem Tipo";
    typeMap[tipo] = (typeMap[tipo] ?? 0) + 1;
  }
  const casesByType = Object.entries(typeMap)
    .map(([tipo, count]) => ({ tipo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Recent activity from results — need case titles
  const recentCaseIds = [...new Set(allResults.map(r => r.case_id))];
  const recentCases = recentCaseIds.length > 0
    ? await db.select().from(legalCasesTable).where(sql`id = ANY(${recentCaseIds})`)
    : [];
  const caseById = Object.fromEntries(recentCases.map(c => [c.id, c]));

  const recentActivity = allResults.map(r => ({
    id: r.id,
    description: `Análise concluída: ${r.skill_name ?? r.workflow_type ?? "N/A"} — ${caseById[r.case_id]?.titulo ?? "Caso #" + r.case_id}`,
    timestamp: r.created_at.toISOString(),
    type: "analysis" as const,
  }));

  res.json({
    total_cases: total,
    active_cases: active,
    completed_analyses: completed,
    pending_cases: pending,
    cases_by_type: casesByType,
    recent_activity: recentActivity,
    workflows_executed: workflows
  });
});

router.get("/skills", async (_req, res): Promise<void> => {
  res.json(LEGAL_SKILLS);
});

export default router;
