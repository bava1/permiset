import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ArticleIcon from "@mui/icons-material/Article";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";

export default function useNavItems() {
  const { t } = useTranslation("common"); // ✅ Теперь хук внутри функции

  return [
    { label: t("menu_home"), path: "/", icon: <HomeIcon />, roles: ["User", "Manager", "Administrator"] },
    { label: t("menu_dashboard"), path: "/dashboard", icon: <DashboardIcon />, roles: ["Manager", "Administrator"] },
    { label: t("menu_users"), path: "/users", icon: <PeopleIcon />, roles: ["Manager", "Administrator"] },
    { label: t("menu_chat"), path: "/chat", icon: <TipsAndUpdatesIcon />, roles: ["User", "Manager", "Administrator"] },
    { label: t("menu_blog"), path: "/blog", icon: <MarkUnreadChatAltIcon />, roles: ["User", "Manager", "Administrator"] },
    { label: t("menu_issues"), path: "/issues", icon: <BugReportIcon />, roles: ["User", "Manager", "Administrator"] },
    { label: t("menu_logs"), path: "/logs", icon: <SyncAltIcon />, roles: ["Administrator"] },
    { label: t("menu_docs"), path: "/docs", icon: <ArticleIcon />, roles: ["Manager", "Administrator"] },
    { label: t("menu_analytics"), path: "/analytics", icon: <InsightsIcon />, roles: ["Manager", "Administrator"] },
    { label: t("menu_settings"), path: "/setting", icon: <SettingsIcon />, roles: ["Administrator"] },
  ];
}
