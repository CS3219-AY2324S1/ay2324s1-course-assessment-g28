import Navbar from "@/components/PeerPrepNavbar";
import QuestionsTable from "@/components/QuestionsTable";
import cx from "classnames";
import { useSession } from "next-auth/react";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "400", subsets: ["latin-ext"] });

export default function Home() {
  const userInfo = useSession().data?.user;
  return (
    <main
      className={cx(
        "flex min-h-screen flex-col items-center",
        poppins.className)}>
      <Navbar />
      <div>
        <h1>
          Main Page
        </h1>
        <QuestionsTable />
      </div>
    </main>
  );
}
