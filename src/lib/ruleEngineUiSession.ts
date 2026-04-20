export const RULE_ENGINE_UI_KEY = "finmom_rule_engine_ui_v1";

export type RuleEngineStep = 1 | 2 | 3;
export type RuleEngineConfirmState = "editing" | "confirming" | "success";

export type RuleEngineUiSession = {
  ragId: string;
  step: RuleEngineStep;
  confirmState: RuleEngineConfirmState;
  finalAnalysis: string | null;
};

export function readRuleEngineUiSession(ragId: string | null): RuleEngineUiSession | null {
  if (typeof window === "undefined") return null;
  const rid = (ragId ?? "").trim();
  if (!rid) return null;
  try {
    const raw = sessionStorage.getItem(RULE_ENGINE_UI_KEY);
    if (!raw?.trim()) return null;
    const o = JSON.parse(raw) as Partial<RuleEngineUiSession> | null;
    if (!o || typeof o !== "object") return null;
    if (o.ragId !== rid) return null;
    if (o.step !== 1 && o.step !== 2 && o.step !== 3) return null;
    if (o.confirmState !== "editing" && o.confirmState !== "confirming" && o.confirmState !== "success") return null;
    return {
      ragId: rid,
      step: o.step,
      confirmState: o.confirmState === "confirming" ? "editing" : o.confirmState,
      finalAnalysis: typeof o.finalAnalysis === "string" || o.finalAnalysis === null ? o.finalAnalysis : null,
    };
  } catch {
    return null;
  }
}

export function clearRuleEngineUiSession(): void {
  try {
    sessionStorage.removeItem(RULE_ENGINE_UI_KEY);
  } catch {
    /* ignore */
  }
}

export function persistRuleEngineUiSession(payload: RuleEngineUiSession): void {
  try {
    sessionStorage.setItem(RULE_ENGINE_UI_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}
