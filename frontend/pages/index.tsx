import Navbar from "@/components/PeerPrepNavbar";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const userInfo = useSession().data?.user;
  return (
    <main
      className={`flex min-h-screen flex-col items-center ${inter.className}`}
    >
      <Navbar />
      <div>
        <h1>
          Main Page
        </h1>
      </div>
    </main>
  );
}
