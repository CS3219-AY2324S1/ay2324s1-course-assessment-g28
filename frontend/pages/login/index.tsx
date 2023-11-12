import LoginPageComponent from "@/components/LoginPage";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { HOME } from "@/routes";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: { destination: HOME },
    };
  }

  return {
    props: {
      providers: (await getProviders()) ?? [],
    },
  };
}

export default function LoginPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return <LoginPageComponent {...props} />;
}
