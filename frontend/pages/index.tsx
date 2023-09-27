import { getUserInfoServerSide } from "@/api/server/user";
import MatchingUI from "@/components/MatchingUI";
import QuestionsCard from "@/components/QuestionsCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";

export const getServerSideProps = (async (context) => {
  // middlware should ensure that session is always present when this is run
  const session = await getServerSession(context.req, context.res, authOptions);
  const userInfo = await getUserInfoServerSide(session!.user!.email!);
  return { props: { userIsAdmin: userInfo.isAdmin } };
}) satisfies GetServerSideProps<{
  userIsAdmin: boolean;
}>;

export default function Home({
  userIsAdmin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="w-full">
      <MatchingUI />
      <QuestionsCard userIsAdmin={userIsAdmin} />
    </div>
  );
}
