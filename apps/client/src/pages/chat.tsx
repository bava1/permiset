import { useTranslation } from "react-i18next";

export default function Chat() {
  const { t } = useTranslation("common");
    return (
      <>
        <h1>{t("chat_ai_Chat")}</h1>
        <p>{t("chat_chat_for_communication_with_artificial")}.</p>
        <p>{t("chat_this_component_is_under_development")}.</p>
        <p>{t("chat_thank_you_for_your_understanding...")}</p>
      </>
    );
  }