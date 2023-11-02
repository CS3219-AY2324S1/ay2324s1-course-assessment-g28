import { HOME } from "@/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => router.replace(HOME), 3000);
    return () => clearTimeout(timeout);
  }, [router]);
  return (
    <div className="flex flex-col justify-center flex-grow">
      <div className="">
        <h1 className="text-xl text-center">
          Oops! You{"'"}re not supposed to visit this page. Redirecting you to
          your homepage...
        </h1>
      </div>
    </div>
  );
}
