import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { HOME } from "@/routes";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import cx from "classnames";
import { RACING_SANS_ONE_CLASS } from "@/assets/fonts/racingSansOne";
import Button from "@/components/Button";
import { useAppearAnimation } from "@/hooks/useAppearAnimation";

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
    <div className="h-full w-full pt-[80px] pl-[140px]">
      <div
        className="w-[450px] text-justify"
        style={{ ...useAppearAnimation() }}
      >
        <div className={cx(RACING_SANS_ONE_CLASS, "text-8xl pb-3")}>
          PeerPrep
        </div>
        <div className="text-[16px] pb-7">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
        <div className="flex justify-start">
          {Object.values(providers).map((p) => (
            <Button onClick={() => signIn(p.id)} key={p.id}>
              Sign in with {p.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
