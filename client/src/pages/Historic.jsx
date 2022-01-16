import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Historic = (props) => {
  const { data, msToDate } = props
  const { web3 } = data
  const [allDonations, setAllDonations] = useState(null)
  const [allProjects, setAllProjects] = useState(null)
  const [allDonors, setAllDonors] = useState(null)

  useEffect(() => {
    getAllDonations()
  }, []);

  useEffect(() => {
    if (allDonations) {
      console.log('allDonations :>> ', allDonations);
    }
  }, [allDonations]);

  useEffect(() => {
    if (allProjects) {
      console.log('allProjects :>> ', allProjects);
    }
  }, [allProjects]);

  useEffect(() => {
    if (allDonors) {
      console.log('allDonors :>> ', allDonors);
    }
  }, [allDonors]);

  const findProjectInfos = (id, info) => {
    for (const key in allProjects) {
      if (allProjects[key].projectId === id.toString()) {
        return allProjects[key][info]
      }
    }
  }

  const getAllDonations = async () => {
    try {
      const { contract } = data
      await contract.methods.getDonations().call()
        .then(x => setAllDonations(x))
      await contract.methods.getProjects().call()
        .then(x => setAllProjects(x))
      await contract.methods.getDonors().call()
        .then(x => setAllDonors(x))

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
        Historique des donations
      </Typography>

      {allDonations && allProjects &&
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow selected>
                <TableCell>Projet</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Montant</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allDonations.map((donation) => (
                <TableRow
                  key={donation.donationId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="donation">
                    {findProjectInfos(donation.projectId, "title")}
                  </TableCell>
                  <TableCell>{findProjectInfos(donation.projectId, "description")}</TableCell>
                  <TableCell>{msToDate(donation.donationDate)}</TableCell>
                  <TableCell sx={{ minWidth: '100px' }}>{web3.utils.fromWei(donation.donationAmount.toString())} EOC</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}

    </>
  )
}

export default Historic
