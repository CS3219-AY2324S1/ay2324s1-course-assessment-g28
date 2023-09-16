import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <NextUIProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </NextUIProvider>
  );
}
