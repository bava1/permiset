import { Box, Divider, Stack, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import React from "react"; 
import { useTranslation } from "react-i18next";

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation("common");
  const dateTime: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }

  const updateDate = new Date(user?.updatedAt || Date.now()).toLocaleDateString("ru-RU", dateTime);
  const createDate = new Date(user?.createdAt || Date.now()).toLocaleDateString("ru-RU", dateTime);

  return (
    <>
      <h1>{t("home_welcome")} { user?.name }</h1>
      <Stack
        direction="row"
        sx={{ mb: 1 }}
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}>
          <span>{t("home_you_are_logged_in_with_permissions")} </span>
          <h4>{ user?.role }</h4>
      </Stack>
      <Stack
        direction="row"
        sx={{ mb: 1 }}
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}>
          <span> {t("home_your_email")} </span>
          <h4>{ user?.email }</h4>
      </Stack>
      <Stack
        direction="row"
        sx={{ mb: 1 }}
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}>
          <span>{t("home_your_status")} </span>
          <h4>{ user?.status }</h4>
      </Stack>
      <Stack
        direction="row"
        sx={{ mb: 1 }}
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}>
          <span>{t("home_date_of_creation")} </span>
          <h4>{ createDate }</h4>
      </Stack>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}>
          <span>{t("home_last_modified_date")} </span>
          <h4>{ updateDate }</h4>
      </Stack>
    </>
  );
}
