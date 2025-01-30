import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';

export default function Docs() {
  const { t } = useTranslation("common");
  return (
    <>
      <h1>{t("docs")}</h1>
      <p>{t("docs_link_to_the")}...</p>
      <Link href="https://github.com/bava1/permiset" variant="h6" target="_blank" sx={{ mb: 2 }}>
        {'Project on GitHub...'}
      </Link>
      <p>{t("docs_link_to_the")}...</p>
      <Link href="https://permiset-express-latest.onrender.com/api-docs/" variant="h6" target="_blank">
        {'Go to Swagger API documentation...'}
      </Link>
      <h3>{t("docs_operating_instructions")}</h3>

      <Box sx={{ width: '100%', maxWidth: 860 }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span" variant="h6">logged</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              LA logged in Administrator does not have access to change their role and does not have the ability to delete their account.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span" variant="h6">Administrator</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
            Only the Administrator has the right to edit roles and delete Users.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span" variant="h6">Manager</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
            The Manager has the right to only add a user with the User role.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

    </>
  );
}