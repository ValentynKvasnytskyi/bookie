import fs from "fs/promises";
import path from "path";
import { env } from "../../config/env.ts";

export interface Translations {
  [key: string]: Record<string, any>;
}

const translationsCache: Translations = {};
const { SUPPORTED_LOCALES } = env;

export async function getTranslations(): Promise<Translations> {
  const translations: Translations = {};

  for (const locale of SUPPORTED_LOCALES) {
    if (translationsCache[locale]) {
      translations[locale] = translationsCache[locale];
      continue;
    }

    const filePath = path.join(process.cwd(), "server", "locales", `${locale}.json`);

    try {
      const data = await fs.readFile(filePath, "utf-8");
      const t = JSON.parse(data);
      translationsCache[locale] = t;
      translations[locale] = t;
    } catch (error) {
      console.error(`Error loading translations for locale "${locale}":`, error);
      translations[locale] = {};
    }
  }

  return translations;
}

// Получение переводов из сервсиса переводов
// import { translationsApiUrl, translationsProjectSlug } from '../config/env.ts';
//
// export default async function fetchTranslations(locale: string) {
//   const url = `${translationsApiUrl}?project=${translationsProjectSlug}&locale=${locale}`;
//
//   const response = await fetch(url, {
//     method: 'GET',
//   });
//
//   const data = await response.json();
//
//   return data['hydra:member']?.[0]?.translations || [];
// }
