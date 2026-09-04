import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

import { AuthProvider } from "@/lib/AuthContext";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";

import { i18nReady } from "@/i18n/config";

const App = ({
  Component,
  pageProps,
}: AppProps) => {
  const router = useRouter();

  const [translationsReady, setTranslationsReady] =
    useState(false);

  // Wait for translations after hydration
  useEffect(() => {
    let isMounted = true;

    void i18nReady.then(() => {
      if (isMounted) {
        setTranslationsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Keep server and first client render identical
  if (!translationsReady) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]" />
    );
  }

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

      <AuthProvider>
        <ToastContainer />

        <Component {...pageProps} />

        {router.pathname !== "/auth" &&
          router.pathname !== "/signup" && (
            <LanguageSwitcher />
          )}
      </AuthProvider>
    </>
  );
};

export default App;