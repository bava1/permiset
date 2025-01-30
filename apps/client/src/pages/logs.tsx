import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';

export default function Issues() {
  const { t } = useTranslation("common");
  return (
    <>
      <h1>{t("logs")}</h1>
      <p>{t("logs_manage_your_logs_here.")}</p>
    </>
  );
}