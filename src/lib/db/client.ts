import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let database:
  | ReturnType<typeof drizzle<typeof schema>>
  | undefined;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }
  return databaseUrl;
}

export function getDb() {
  if (!database) {
    const client = neon(getDatabaseUrl());
    database = drizzle(client, { schema });
  }
  return database;
}
