import { Box } from '@mui/material';
import Link from '@mui/material/Link';

export default function Docs() {
  return (
    <div>
      <h1>Docs</h1>
      <p>Project documentation.</p>
      <Link href="https://github.com/bava1/permiset" variant="h6" target="_blank">
        {'Project on GitHub...'}
      </Link>
      <h3>Operating instructions:</h3>
      <p>
        1. A logged in Administrator does not have access to change their role and does not have the ability to delete their account.
      </p>
      <p>
        2. Only the Administrator has the right to edit roles and delete Users.
      </p>
      <p>
        3. The Manager has the right to only add a user with the User role.
      </p>
    </div>
  );
}