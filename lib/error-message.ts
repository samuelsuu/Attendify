const NETWORK_ERROR_MESSAGE =
  "Couldn't reach the server. Check your internet connection and try again.";

function looksLikeNetworkError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("failed to connect")
  );
}

/**
 * Normalizes any thrown value into a readable message.
 *
 * Supabase query errors are real `Error` instances (PostgrestError extends
 * Error), so their `.message` is safe to show directly. But when the
 * underlying `fetch()` call itself fails — no connectivity, DNS failure,
 * request timeout — React Native/Hermes can reject with a plain object or
 * string instead of an `Error` (postgrest-js even guards for this explicitly
 * in its own source). That case has no useful message to surface, and is
 * overwhelmingly a connectivity problem in practice, so it gets a specific,
 * actionable fallback instead of a vague "something went wrong".
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return looksLikeNetworkError(err.message) ? NETWORK_ERROR_MESSAGE : err.message;
  }

  if (typeof err === "string" && err.trim()) {
    return looksLikeNetworkError(err) ? NETWORK_ERROR_MESSAGE : err;
  }

  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    const message = (err as { message: string }).message;
    return looksLikeNetworkError(message) ? NETWORK_ERROR_MESSAGE : message;
  }

  return NETWORK_ERROR_MESSAGE;
}
