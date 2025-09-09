import { SQLDatabase } from "encore.dev/storage/sqldb";

export const pasteDB = new SQLDatabase("paste", {
  migrations: "./migrations",
});
