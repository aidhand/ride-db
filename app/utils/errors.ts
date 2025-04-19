import type { NuxtError } from "#app";
import { ZodError } from "zod";

export function isNuxtZodError(
  err: unknown,
): err is NuxtError<{ data: ZodError }> {
  return (
    isNuxtError(err) &&
    (err.data as { data?: unknown })?.data instanceof ZodError
  );
}
