import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/lib/AuthContext";
import "@/i18n/config"
import LanguageSwitcher from "@/components/language/LanguageSwitcher";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Code Quest</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <AuthProvider>
        <ToastContainer />
      <Component {...pageProps} />

      <LanguageSwitcher />
      </AuthProvider>
      
    </>
  );
}
