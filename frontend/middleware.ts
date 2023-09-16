export { default } from "next-auth/middleware"

// prevent unauthenticated access to all pages except sign in 
export const config = { matcher: ['/((?!/api/auth).*)'] }