import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth?.user);
  const { pathname } = request.nextUrl;
  const isOnDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isOnLogin = pathname === "/login";
  const role = request.auth?.user?.role;

  if (isLoggedIn && role === "Usuário" && isOnDashboard) {
    return NextResponse.redirect(new URL("/area-usuario", request.nextUrl.origin));
  }

  if (isLoggedIn && role === "Usuário" && isOnLogin) {
    return NextResponse.redirect(new URL("/area-usuario", request.nextUrl.origin));
  }

  if (isOnDashboard && !isLoggedIn) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isOnLogin && isLoggedIn) {
    const destino = role === "Usuário" ? "/area-usuario" : "/dashboard";
    return NextResponse.redirect(new URL(destino, request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login"],
};
