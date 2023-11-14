import QuestionsCard from "@/components/QuestionsCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";

export default function Home() {
  return (
    <div className="w-full">
      <QuestionsCard/>
    </div>
  );
}
