import Link from '@mui/material/Link';

export default function Issues() {
  return (
    <div>
      <h1>Logs</h1>
      <p>Manage your logs here.</p>
      <Link href="http://localhost:3000/api-docs" variant="body2" target="_blank">
        {'Swagger API documentation'}
      </Link>
    </div>
  );
}