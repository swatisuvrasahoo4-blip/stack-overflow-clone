import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

export const namespaces = [
  "answers",
  "auth",
  "community",
  "create_post",
  "language",
  "login_activity",
  "navbar",
  "notifications",
  "profile",
  "questions",
  "reports",
  "reputation",
  "right_sidebar",
  "search",
  "sessions",
  "sidebar",
  "subscription",
  "support",
  "tag",
];

export const i18nReady = i18n.isInitialized
  ? Promise.resolve(i18n)
  : i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        lng: "en",
        fallbackLng: "en",

        supportedLngs: [
          "en",
          "fr",
          "es",
          "hi",
          "pt",
          "zh",
        ],

        ns: namespaces,
        defaultNS: "navbar",

        backend: {
          loadPath:
            "/locales/{{lng}}/{{ns}}.json",
        },

        interpolation: {
          escapeValue: false,
        },

        react: {
          useSuspense: false,
        },
      });

export default i18n;