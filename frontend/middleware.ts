import { LOGIN } from "@/routes";
import { withAuth } from "next-auth/middleware";

// prevent unauthenticated access to all pages except sign in 
export const config = { matcher: ['/((?!/login).*)'] }
export default withAuth({
  pages: {
    signIn: LOGIN
  }
});