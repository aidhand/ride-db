import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../database/schema';

export function useDB() {
  return drizzle(process.env.DATABASE_URL!, { schema });
}
export const tables = schema;

export type User = typeof tables.users.$inferSelect;
export type NewUser = typeof tables.users.$inferInsert;
export type Session = typeof tables.sessions.$inferSelect;
export type NewSession = typeof tables.sessions.$inferInsert;
export type Brand = typeof tables.brands.$inferSelect;
export type NewBrand = typeof tables.brands.$inferInsert;
export type Item = typeof tables.items.$inferSelect;
export type NewItem = typeof tables.items.$inferInsert;
export type Category = typeof tables.categories.$inferSelect;
export type NewCategory = typeof tables.categories.$inferInsert;
