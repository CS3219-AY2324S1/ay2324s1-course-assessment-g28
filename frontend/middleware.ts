import { API_PREFIX } from "@/api/routes";
import { HOME, LOGIN, REGISTER } from "@/routes";
import { getFirstPartOfPath } from "@/util/url";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// prevent unauthenticated access to all pages except sign in
export const config = { matcher: ["/((?!/login).*)"] };
export default withAuth(async function middleware(req) {
  if (getFirstPartOfPath(req.nextUrl.pathname) === API_PREFIX) {
    // ignore api handler routes
    return;
  }
    //@ts-ignore
  if (req.nextUrl.pathname !== REGISTER && !req.nextauth.token.userExists) {
    // if user does not exist, then redirect to register page
    return NextResponse.redirect(new URL(REGISTER, req.url))
    //@ts-ignore
  } else if (req.nextUrl.pathname === REGISTER && req.nextauth.token.userExists) {
    // redirect to home page if already registered user
    return NextResponse.redirect(new URL(HOME, req.url));
  }
}, {
  pages: {
    signIn: LOGIN,
  },
});
