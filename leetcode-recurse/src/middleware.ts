export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/problems/:path*",
    "/view-problems/:path*",
    "/account-settings/:path*",
  ],
};
