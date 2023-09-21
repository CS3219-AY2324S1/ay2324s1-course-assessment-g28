import QuestionsCard from "@/components/QuestionsCard";
import UserInfoCard from "@/components/UserInfoCard";

export default function Home() {
  return (
    <div className="w-full flex gap-8">
      <UserInfoCard />
      <QuestionsCard />
    </div>
  );
}
