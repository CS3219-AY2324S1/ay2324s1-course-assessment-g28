import { getUserInfoServerSide } from "@/api/server/user";
import { LOGIN } from "@/routes";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: LOGIN,
  },
  callbacks: {
    jwt: async ({ token }) => {
      try {
        const userInfo = await getUserInfoServerSide(token?.email ?? "");
        token.userExists = true;
        token.username = userInfo?.username;
        token.isAdmin = userInfo?.isAdmin ?? false;
      } catch (e) {
        // the given user is not in our own database
        token.userExists = false;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.isAdmin = (token.isAdmin ?? false) as boolean;
      session.user.username = (token?.username) as string | undefined;
      return session;
    },
  },
};

export default NextAuth(authOptions);
