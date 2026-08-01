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
