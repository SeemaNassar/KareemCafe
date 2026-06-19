import type { NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
  return undefined;
}

export const config = {
  matcher: [],
};
