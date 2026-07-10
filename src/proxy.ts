import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isJwtValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );

    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const cookieNames = [
    "sb-mbhybabdwpkcxnnkoutm-auth-token",
    "sb-access-token",
  ];

  let rawCookie: string | undefined;
  for (const name of cookieNames) {
    rawCookie = request.cookies.get(name)?.value;
    if (rawCookie) break;
  }

  let accessToken: string | undefined;

  if (rawCookie) {
    try {
      const parsed = JSON.parse(rawCookie);
      accessToken = parsed.access_token;
    } catch {
      accessToken = rawCookie;
    }
  }

  if (!accessToken || !isJwtValid(accessToken)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
