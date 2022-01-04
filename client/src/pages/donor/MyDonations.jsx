import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const MyDonations = (props) => {
  const { data, msToDate } = props
  const { web3 } = data
  const [allMyDonations, setAllMyDonations] = useState(null)
  const [allProjects, setAllProjects] = useState(null)

  useEffect(() => {
    getMyDonations()
  }, []);

  useEffect(() => {
    console.log('allMyDonations :>> ', allMyDonations);
    console.log('allProjects :>> ', allProjects);
  }, [allMyDonations, allProjects]);

  const findProjectInfos = (id, info) => {
    for (const key in allProjects) {
      if (allProjects[key].projectId === id.toString()) {
        return allProjects[key][info]
      }
    }
  }

  const getMyDonations = async () => {
    try {
      const { contract, accounts } = data
      await contract.methods.getDonationPerDonor(accounts[0]).call()
        .then(x => setAllMyDonations(x))
      await contract.methods.getProjects().call()
        .then(x => setAllProjects(x))

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
        Liste de mes donations
      </Typography>

      {allMyDonations &&
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow selected>
                <TableCell>Projet</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Montant (EOC)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allMyDonations.map((donation) => (
                <TableRow
                  key={donation.donationId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="donation">
                    {findProjectInfos(donation.projectId, "title")}
                  </TableCell>
                  <TableCell>{findProjectInfos(donation.projectId, "description")}</TableCell>
                  <TableCell>{msToDate(donation.donationDate)}</TableCell>
                  <TableCell>{web3.utils.fromWei(donation.donationAmount.toString())}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}
    </>
  )
}

export default MyDonations
