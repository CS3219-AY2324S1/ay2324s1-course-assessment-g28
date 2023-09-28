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
        const userInfo = await getUserInfoServerSide(token.email!);
        token.userExists = true;
        //@ts-ignore
        token.username = userInfo!.username;
        token.isAdmin = userInfo!.isAdmin;
      } catch (e) {
        // the given user is not in our own database
        token.userExists = false;
      }
      return token;
    },
    session: async ({ session, token }) => {
      //@ts-ignore
      session.user.isAdmin = token.isAdmin;
      //@ts-ignore
      session.user.username = token.username;
      return session;
    },
  },
};

export default NextAuth(authOptions);
