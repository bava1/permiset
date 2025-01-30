import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Blog() {
  const { t } = useTranslation("common");
  return (
    <>
      <h1>{t("blog")}</h1>
      <p>{t("blog_a_blog_will_be_created_for_you_here")}</p>
      <p>{t("blog_this_component_is_under_development")}</p>
      <p>{t("blog_thank_you_for_your_understanding...")}</p>
    </>
  );
}