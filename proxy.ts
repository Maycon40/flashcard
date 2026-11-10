import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSessionToken(request: NextRequest): string | undefined {
  return request.cookies.get("session_id")?.value;
}

type SessionValidation = "valid" | "invalid" | "unavailable";

async function validateSession(
  token: string,
  origin: string,
): Promise<SessionValidation> {
  const apiUrl = new URL("/api/v1/sessions/validate", origin);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Cookie: `session_id=${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 200) {
      return "valid";
    }

    return response.status === 401 ? "invalid" : "unavailable";
  } catch (error) {
    console.log("Erro na validação da sessão:", error);
    return "unavailable";
  }
}

function redirect(page: string, request: NextRequest): NextResponse {
  const pageUrl = new URL(page, request.url);
  return NextResponse.redirect(pageUrl);
}

function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set("session_id", "invalid", {
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const sessionToken = getSessionToken(request);

  if (pathname === "/login" || pathname === "/signup") {
    if (sessionToken) {
      const validation = await validateSession(sessionToken, origin);

      if (validation === "valid") {
        return redirect("/dashboard", request);
      }

      if (validation === "invalid") {
        return clearSessionCookie(NextResponse.next());
      }
    }
  } else if (pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      return redirect("/login", request);
    }

    const validation = await validateSession(sessionToken, origin);

    if (validation !== "valid") {
      const response = redirect("/login", request);

      return validation === "invalid" ? clearSessionCookie(response) : response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
