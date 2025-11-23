import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/problems/:path*",
    "/view-problems/:path*",
    "/account-settings/:path*",
  ],
};
