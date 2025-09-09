import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { pasteDB } from "./db";

export interface ListPastesParams {
  limit?: Query<number>;
  offset?: Query<number>;
}

export interface PasteSummary {
  id: string;
  title?: string;
  language: string;
  createdAt: Date;
  expiresAt?: Date;
  views: number;
}

export interface ListPastesResponse {
  pastes: PasteSummary[];
  total: number;
}

// Retrieves a list of recent pastes (excluding content for performance).
export const list = api<ListPastesParams, ListPastesResponse>(
  { expose: true, method: "GET", path: "/paste" },
  async (params) => {
    const limit = Math.min(params.limit || 20, 100);
    const offset = params.offset || 0;

    const pastes = await pasteDB.queryAll<{
      id: string;
      title: string | null;
      language: string;
      created_at: Date;
      expires_at: Date | null;
      views: number;
    }>`
      SELECT id, title, language, created_at, expires_at, views
      FROM pastes
      WHERE expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const totalResult = await pasteDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM pastes
      WHERE expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP
    `;

    return {
      pastes: pastes.map(paste => ({
        id: paste.id,
        title: paste.title || undefined,
        language: paste.language,
        createdAt: paste.created_at,
        expiresAt: paste.expires_at || undefined,
        views: paste.views,
      })),
      total: totalResult?.count || 0,
    };
  }
);
