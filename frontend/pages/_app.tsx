import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import Layout from "@/components/Layout";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { QuestionTableProvider } from "@/components/QuestionsCard/QuestionsTableContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <NextUIProvider>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <QuestionTableProvider>
            <Toaster />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QuestionTableProvider>
        </ThemeProvider>
      </SessionProvider>
    </NextUIProvider>
  );
}
