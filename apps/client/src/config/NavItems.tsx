import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BugReportIcon from "@mui/icons-material/BugReport";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';



export const NAV_ITEMS = [
  { label: "Home", path: "/", icon: <HomeIcon />, roles: ["User", "Manager", "Administrator"] },
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, roles: ["Manager", "Administrator"] },
  { label: "Users", path: "/users", icon: <PeopleIcon />, roles: ["Manager", "Administrator"] },
  { label: "Chat", path: "/chat", icon: <TipsAndUpdatesIcon />, roles: ["User", "Manager", "Administrator"] },
  { label: "Blog", path: "/blog", icon: <MarkUnreadChatAltIcon />, roles: ["User", "Manager", "Administrator"] },
  { label: "Issues", path: "/issues", icon: <BugReportIcon />, roles: ["User", "Manager", "Administrator"] },
  { label: "Logs", path: "/logs", icon: <SyncAltIcon />, roles: ["Administrator"] },
  { label: "Docs", path: "/docs", icon: <ArticleIcon />, roles: ["Administrator"] },
  { label: "Settings", path: "/setting", icon: <SettingsIcon />, roles: ["Administrator"] },
];