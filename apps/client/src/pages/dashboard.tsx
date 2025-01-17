
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
      <h1>Welcome to Dashboard!</h1>
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          General information about users
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
        <Typography variant="body1">
          Total registered: {users.length}
          <br />
          Total registered active: {(users.filter((user) => user.status === 'active')).length}
          <br />
          Total registered inactive: {(users.filter((user) => user.status === 'inactive')).length}
          <br />
          Total registered role - Administrator: {(users.filter((user) => user.role === 'Administrator')).length}
          <br />
          Total registered role - Manager: {(users.filter((user) => user.role === 'Manager')).length}
          <br />
          Total registered role - User: {(users.filter((user) => user.role === 'User')).length}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
    </>
  );
}




