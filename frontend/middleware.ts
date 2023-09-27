import { LOGIN, REGISTER } from "@/routes";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// prevent unauthenticated access to all pages except sign in
export const config = { matcher: ["/((?!/login).*)"] };
export default withAuth(async function middleware(req) {
  //@ts-ignore
  if (!req.nextauth.token.userExists) {
    // if user does not exist, then redirect to register page
    return NextResponse.redirect(new URL(REGISTER, req.url))
  }
}, {
  pages: {
    signIn: LOGIN,
  },
});
