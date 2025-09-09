import { api, APIError } from "encore.dev/api";
import { pasteDB } from "./db";

export interface GetPasteParams {
  id: string;
}

export interface Paste {
  id: string;
  title?: string;
  content: string;
  language: string;
  createdAt: Date;
  expiresAt?: Date;
  views: number;
}

// Retrieves a paste by its ID and increments the view count.
export const get = api<GetPasteParams, Paste>(
  { expose: true, method: "GET", path: "/paste/:id" },
  async (params) => {
    // Check if paste exists and hasn't expired
    const paste = await pasteDB.queryRow<{
      id: string;
      title: string | null;
      content: string;
      language: string;
      created_at: Date;
      expires_at: Date | null;
      views: number;
    }>`
      SELECT id, title, content, language, created_at, expires_at, views
      FROM pastes
      WHERE id = ${params.id}
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;

    if (!paste) {
      throw APIError.notFound("paste not found or expired");
    }

    // Increment view count
    await pasteDB.exec`
      UPDATE pastes SET views = views + 1 WHERE id = ${params.id}
    `;

    return {
      id: paste.id,
      title: paste.title || undefined,
      content: paste.content,
      language: paste.language,
      createdAt: paste.created_at,
      expiresAt: paste.expires_at || undefined,
      views: paste.views + 1,
    };
  }
);
