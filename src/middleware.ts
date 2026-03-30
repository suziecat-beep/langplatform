import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/admin")) {
        return token?.role === "ADMIN" || token?.role === "MODERATOR";
      }
      if (path.startsWith("/dashboard") || path.startsWith("/resources/upload")) {
        return !!token;
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/resources/upload", "/admin/:path*"],
};
