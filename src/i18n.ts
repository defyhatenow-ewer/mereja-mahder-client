import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { lngs } from "./config";

export const initPromise = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    fallbackLng: "en",
    debug: true,
  });

export const translate = async (key: string) => {
  await initPromise;
  return i18next.t(key);
};

export const pickLanguageToDisplay = (resolvedLanguage?: string) => {
  if (resolvedLanguage && resolvedLanguage !== "en")
    return lngs["en"].nativeName;
  const browserLanguage = navigator.language.substring(
    0,
    2
  ) as keyof typeof lngs;
  if (browserLanguage in lngs) return lngs[browserLanguage].nativeName;
  return lngs["en"].nativeName;
};

export default i18next;
