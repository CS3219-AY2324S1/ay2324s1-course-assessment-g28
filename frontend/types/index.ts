// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"; // do not remove this import

declare module "next-auth" {
  interface Session {
    user: {
      name?: string;
      email?: string;
      image?: string;
      username?: string;
      isAdmin?: boolean;
    };
  }
}
