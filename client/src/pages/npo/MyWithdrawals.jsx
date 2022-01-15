import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const MyWithdrawals = (props) => {
  const { data, msToDate } = props
  const { web3 } = data
  const [allMyWithdrawals, setAllMyWithdrawals] = useState(null)

  useEffect(() => {
    getMyWithdrawals()
  }, []);

  useEffect(() => {
    if (allMyWithdrawals) {
      console.log('allMyWithdrawals :>> ', allMyWithdrawals);
    }
  }, [allMyWithdrawals]);

  const getMyWithdrawals = async () => {
    try {
      const { contract, accounts } = data
      await contract.methods.getWithdrawalPerNpo(accounts[0]).call()
        .then(x => setAllMyWithdrawals(x))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
        sx={{ mb: 2 }}
      >
        Liste de mes demandes de retrait
      </Typography>

      {allMyWithdrawals &&
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow selected>
                <TableCell sx={{ typography: 'upper' }}>Projet</TableCell>
                <TableCell sx={{ typography: 'upper' }}>Description</TableCell>
                <TableCell sx={{ typography: 'upper' }}>Date</TableCell>
                <TableCell sx={{ typography: 'upper' }}>Montant</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allMyWithdrawals.map((withdrawal) => (
                <TableRow
                  key={withdrawal.withdrawalId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="donation">
                    {withdrawal.title}
                  </TableCell>
                  <TableCell>{withdrawal.description}</TableCell>
                  <TableCell>{msToDate(withdrawal.withdrawalDate)}</TableCell>
                  <TableCell sx={{ minWidth: '70px' }}>{web3.utils.fromWei(withdrawal.amount.toString())}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}
    </>
  )
}

export default MyWithdrawals
