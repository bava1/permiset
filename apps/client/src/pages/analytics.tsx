import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Analytics() {
  const { t } = useTranslation("common");
  return (
    <>
      <h1>{t("analytics")}</h1>
      <p>{t("analytics_here_you_will_find_analytical_data.")}</p>
      <p>{t("analytics_this_component_is_under_development")}</p>
      <p>{t("analytics_thank_you_for_your_understanding...")}</p>
    </>
  );
}