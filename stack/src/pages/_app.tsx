import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/lib/AuthContext";
import { useRouter } from "next/router";
import "@/i18n/config";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Code Quest</title>

        <link
          rel="icon"
          href="/favicon.png"
          type="image/png"
        />

        <link
          rel="shortcut icon"
          href="/favicon.png"
        />
      </Head>

      <Suspense fallback={null}>
        <AuthProvider>
          <ToastContainer />

          <Component {...pageProps} />

          {router.pathname !== "/auth" &&
            router.pathname !== "/signup" && (
              <LanguageSwitcher />
            )}
        </AuthProvider>
      </Suspense>
    </>
  );
}