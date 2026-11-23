/**
 * backend-service.ts
 * Handles all HTTP calls to the FastAPI backend (http://localhost:8000).
 * The base URL is read from the Next.js env variable NEXT_PUBLIC_BACKEND_API_URL.
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

// ─── Types matching backend schema (message.py) ────────────────────────────

export interface BackendEntitySpan {
  text: string;
  label: string;
  start: number;
  end: number;
}

export interface BackendIntentPrediction {
  predicted_class: number;
  intent: string;
  confidence: number;
}

export interface BackendHandlerResponse {
  status: string;
  result: Record<string, unknown>[];
}

export interface BackendPredictResponse {
  intents: BackendIntentPrediction[];
  threshold: number;
  entities: BackendEntitySpan[];
  handler_results: BackendHandlerResponse;
  draft_response: string | null;
}

// ─── Main call ─────────────────────────────────────────────────────────────

/**
 * POST /intent/predict
 * Sends a CS message to the AI backend and returns the full prediction result.
 *
 * @throws Error when the backend is unreachable or returns a non-OK status
 */
export async function predictIntent(
  message: string
): Promise<BackendPredictResponse> {
  const res = await fetch(`${BACKEND_URL}/intent/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(
      `Backend error ${res.status}: ${errorBody || res.statusText}`
    );
  }

  return res.json() as Promise<BackendPredictResponse>;
}

// ─── Helpers to map backend response → frontend UI types ───────────────────

/**
 * Pick the best (highest confidence) intent label from the response.
 */
export function pickTopIntent(response: BackendPredictResponse): string {
  if (!response.intents || response.intents.length === 0) {
    return "Intent: Tidak Terdeteksi";
  }
  const top = response.intents.reduce((best, cur) =>
    cur.confidence > best.confidence ? cur : best
  );
  return `Intent: ${top.intent} (${(top.confidence * 100).toFixed(1)}%)`;
}

/**
 * Convert backend entity spans to the frontend { label, value } format.
 */
export function mapEntitiesToFrontend(
  entities: BackendEntitySpan[]
): { label: string; value: string }[] {
  return entities.map((e) => ({
    label: e.label,
    value: e.text,
  }));
}

/**
 * Build a human-readable AI reply text from the backend response.
 * Falls back to a generic message when no draft_response is provided.
 */
export function buildAiReplyText(response: BackendPredictResponse): string {
  if (response.draft_response) {
    return response.draft_response;
  }

  const topIntent = response.intents?.[0];
  if (!topIntent) {
    return "Query telah dievaluasi oleh backend AI. Tidak ada intent yang terdeteksi.";
  }

  return `Query telah dievaluasi oleh backend AI. Intent terdeteksi: "${topIntent.intent}" dengan confidence ${(topIntent.confidence * 100).toFixed(1)}%.`;
}

