import React, { useEffect } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ViewNpos = (props) => {
  const { allNpos } = props

  useEffect(() => {
    console.log('allNpos :>> ', allNpos);
  }, []);

  return (
    <>
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
        sx={{ mb: 2 }}
      >
        Liste des NPO
      </Typography>

      {allNpos &&
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow selected>
                <TableCell>Dénomination</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell>Objet</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allNpos.map((npo) => (
                <TableRow
                  key={npo.denomination}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="npo">
                    {npo.denomination}
                  </TableCell>
                  <TableCell>{npo.postalAddress}</TableCell>
                  <TableCell>{npo.object}</TableCell>
                  <TableCell>{npo.npoType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </>
  )
}

export default ViewNpos
