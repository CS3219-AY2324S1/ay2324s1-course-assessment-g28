import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { HOME } from "@/routes";
import { Button } from "@nextui-org/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";

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

export default function LoginPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      {Object.values(providers).map((p) => (
        <Button onClick={() => signIn(p.id)} key={p.id}>
          Sign in with {p.name}
        </Button>
      ))}
    </div>
  );
}
