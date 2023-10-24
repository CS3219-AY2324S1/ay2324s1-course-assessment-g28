import { API_PREFIX } from "@/api/routes";
import {
  CREATE_QUESTION,
  HOME,
  LOGIN,
  REGISTER,
  UPDATE_PATH_SEGMENT,
} from "@/routes";
import { getFirstPartOfPath } from "@/util/url";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// prevent unauthenticated access to all pages except sign in
export const config = { matcher: ["/((?!/login).*)"] };
export default withAuth(
  async function middleware(req) {
    if (getFirstPartOfPath(req.nextUrl.pathname) === API_PREFIX) {
      // ignore api handler routes
      return;
    }
    const isUserExists = req?.nextauth?.token?.userExists ?? false;
    const isAdmin = req?.nextauth?.token?.isAdmin ?? false;
    if (req.nextUrl.pathname !== REGISTER && !isUserExists) {
      // if user does not exist, then redirect to register page
      return NextResponse.redirect(new URL(REGISTER, req.url));
    } else if (req.nextUrl.pathname === REGISTER && isUserExists) {
      // redirect to home page if already registered user
      return NextResponse.redirect(new URL(HOME, req.url));
    } else if (
      (req.nextUrl.pathname === CREATE_QUESTION ||
        req.nextUrl.pathname.substring(
          req.nextUrl.pathname.lastIndexOf("/"),
        ) === UPDATE_PATH_SEGMENT) &&
      !isAdmin
    ) {
      // if not admin but try to access create and update question paths, redirect back to home
      return NextResponse.redirect(new URL(HOME, req.url));
    }
  },
  {
    pages: {
      signIn: LOGIN,
    },
  },
);
