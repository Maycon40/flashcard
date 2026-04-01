import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSessionToken(request: NextRequest): string | undefined {
  return request.cookies.get("session_id")?.value;
}

async function isValidSession(token: string, origin: string): Promise<boolean> {
  const apiUrl = new URL("/api/v1/user", origin);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Cookie: `session_id=${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.log("Erro na validação da sessão:", error);
  }

  return false;
}

function redirect(page: string, request: NextRequest): NextResponse {
  const pageUrl = new URL(page, request.url);
  return NextResponse.redirect(pageUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const sessionToken = getSessionToken(request);

  if (pathname == "/login" || pathname == "/signup") {
    if (sessionToken) {
      const authorized = await isValidSession(sessionToken, origin);

      if (authorized) {
        return redirect("/dashboard", request);
      }
    }
  } else if (pathname.includes("/dashboard")) {
    if (!sessionToken) {
      return redirect("/login", request);
    }

    const authorized = await isValidSession(sessionToken, origin);

    if (!authorized) {
      return redirect("/login", request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
