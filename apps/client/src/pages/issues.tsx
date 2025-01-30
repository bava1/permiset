import { useTranslation } from "react-i18next";

export default function Issues() {
  const { t } = useTranslation("common");
  return (
    <>
      <h1>{t("issues")}</h1>
      <p>{t("issues_solved_issues_will_be_described")}</p>
      <p>{t("issues_this_component_is_under_development")}</p>
      <p>{t("issues_thank_you_for_your_understanding...")}</p>
    </>
  );
}