import { api } from "encore.dev/api";
import { pasteDB } from "./db";
import { generateId } from "./utils";

export interface CreatePasteRequest {
  title?: string;
  content: string;
  language?: string;
  expiresIn?: number; // minutes
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

// Creates a new paste.
export const create = api<CreatePasteRequest, Paste>(
  { expose: true, method: "POST", path: "/paste" },
  async (req) => {
    const id = generateId();
    const expiresAt = req.expiresIn 
      ? new Date(Date.now() + req.expiresIn * 60 * 1000)
      : null;

    await pasteDB.exec`
      INSERT INTO pastes (id, title, content, language, expires_at)
      VALUES (${id}, ${req.title || null}, ${req.content}, ${req.language || 'text'}, ${expiresAt})
    `;

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
      WHERE id = ${id}
    `;

    if (!paste) {
      throw new Error("Failed to create paste");
    }

    return {
      id: paste.id,
      title: paste.title || undefined,
      content: paste.content,
      language: paste.language,
      createdAt: paste.created_at,
      expiresAt: paste.expires_at || undefined,
      views: paste.views,
    };
  }
);
