// import { drizzle } from "drizzle-orm/bun-sql";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../database/schema";

export { and, eq, or, sql } from "drizzle-orm";

export const tables = schema;

export function useDB() {
  return drizzle(process.env.DATABASE_URL!, { schema });
}
export type Role = typeof tables.roles.$inferSelect;
export type User = typeof tables.users.$inferSelect;
export type Brand = typeof tables.brands.$inferSelect;
export type Item = typeof tables.items.$inferSelect;
