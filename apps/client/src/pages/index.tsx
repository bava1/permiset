import { Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import React from "react"; // Добавьте это в начало файла


export default function Home() {
  const { user } = useAuth();
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
      <h1>Welcome { user?.name }</h1>
      <h4>You are logged in with permissions: { user?.role }</h4>
      <h4>Your email: { user?.email }</h4>
      <h4>Your status: { user?.status }</h4>
      <h4>Date of creation: { createDate }</h4>
      <h4>Last modified date: { updateDate }</h4> 
    </>
  );
}