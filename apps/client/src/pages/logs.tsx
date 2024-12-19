import Link from '@mui/material/Link';

export default function Issues() {
  return (
    <div>
      <h1>Logs</h1>
      <p>Manage your logs here.</p>
      <Link href="https://permiset-server-8-latest.onrender.com/api-docs/" variant="h6" target="_blank">
        {'Go to Swagger API documentation...'}
      </Link>
    </div>
  );
}