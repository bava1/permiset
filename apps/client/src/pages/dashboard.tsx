
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { fetchUsers } from "../api/users";
import { set } from 'zod';
import { useEffect, useState } from 'react';
import { User } from '../utils/interfaces/IUser';
import { useTranslation } from 'react-i18next';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function Dashboard() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const { t } = useTranslation("common");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data); 
      } catch (err: any) {
        setError(err.message || "Failed to fetch users");
      };
    };

    loadUsers(); 
  }, []);
  
  return (
    <>
      <h1>{t("dashboard_welcome_to_Dashboard")}</h1>
      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {t("dashboard_general_information_about_users")}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
          <Typography variant="body1">
            {t("dashboard_total_registered")}: {users.length}
            <br />
            {t("dashboard_total_registered_active")}: {(users.filter((user) => user.status === 'active')).length}
            <br />
            {t("dashboard_total_registered_inactive")}: {(users.filter((user) => user.status === 'inactive')).length}
            <br />
            {t("dashboard_total_registered_role_Administrator")}: {(users.filter((user) => user.role === 'Administrator')).length}
            <br />
            {t("dashboard_total_registered_role_Manager")}: {(users.filter((user) => user.role === 'Manager')).length}
            <br />
            {t("dashboard_total_registered_role_User")}: {(users.filter((user) => user.role === 'User')).length}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </>
  );
}




