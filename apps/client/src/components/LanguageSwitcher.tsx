import { MenuItem, Select, SelectChangeEvent, Avatar, Box } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import i18n from "i18next";

const languages = [
    { code: "cz", name: "CZ", flag: "/img/cz-min.jpg" },
    { code: "en", name: "EN", flag: "/img/en-min.jpg" },
    { code: "de", name: "DE", flag: "/img/de-min.jpg" },
    { code: "ua", name: "UA", flag: "/img/ua-min.jpg" },
    { code: "ru", name: "RU", flag: "/img/ru-min.jpg" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [lang, setLang] = useState<string>(i18n.language || "en");

  const changeLanguage = (event: SelectChangeEvent) => {
    const selectedLang = event.target.value;
    setLang(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("i18nextLng", selectedLang); // ✅ Save the selected language
  };

  return (
    <Select
      value={lang}
      onChange={changeLanguage}
      displayEmpty
      sx={{ color: "white", width: 100, boxShadow: "none", "& fieldset": { border: "none" } }} // ✅Set the minimum width
    >
      {languages.map(({ code, name, flag }) => (
        <MenuItem key={code} value={code}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={flag} alt={code} sx={{ width: 26, height: 26 }} /> {/* ✅Flag  */}
            {name} {/* ✅ Language name */}
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
}
