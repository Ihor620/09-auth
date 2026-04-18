import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseURL}/api/auth/session`, {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      const setCookie = res.headers.get("set-cookie");
      if (setCookie && res.ok) {
        const data = await res.json();
        isAuthenticated = data?.success === true;

        if (isAuthenticated) {
          response = NextResponse.next();
          const cookieArray = setCookie.split(",");
          for (const cookieStr of cookieArray) {
            const [nameValue] = cookieStr.trim().split(";");
            const [name, value] = nameValue.split("=");
            if (name && value) {
              response.cookies.set(name.trim(), value.trim(), {
                httpOnly: true,
                path: "/",
              });
            }
          }
        }
      } else {
        const data = await res.json();
        isAuthenticated = data?.success === true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};