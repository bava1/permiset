import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi) // 🔹 Подключаем загрузку JSON-файлов
  .use(LanguageDetector) // 🔹 Автоматически определяет язык
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ru", "cz", "de", "ua"], // 🔹 Доступные языки
    fallbackLng: "en", // 🔹 Если язык не найден — используем английский
    debug: true, // 🔹 Включаем логи
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/common.json", // 🔹 Путь к JSON-файлам
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"], // 🔹 Определяем язык
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
