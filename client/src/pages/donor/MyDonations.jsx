import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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

  const findProjectPropertyValue = (id, propertyName) => {
    for (const key in allProjects) {
      if (allProjects[key].projectId === id.toString()) {
        let tempValue = allProjects[key][propertyName];
        let returnedValue = tempValue;
        switch(propertyName) {
          case "cause":
            switch(tempValue) {
              case "0":
                returnedValue = "Lutte contre la pauvreté et l'exclusion";
                break;
              case "1":
                returnedValue = "Environnement et animaux";
                break;
              case "2":
                returnedValue = "Education";
                break;
              case "3":
                returnedValue = "Art et culture";
                break;
              case "4":
                returnedValue = "Sante et recherche";
                break;
              case "5":
                returnedValue = "Droits de l'homme";
                break;
              case "6":
                returnedValue = "Infrastructure routière";
                break;
              default:
                returnedValue = "Cause inconnue";
            }
            break;            
          case "minAmount":
            returnedValue = tempValue/10**18;
            break;            
          case "maxAmount":
            returnedValue = tempValue/10**18;
            break;            
          case "projectTotalDonations":
            returnedValue = tempValue/10**18;
            break;            
          default:
            returnedValue = tempValue;
            break;            
        }
        return returnedValue;
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

  const DonationRow = (props) => {
    const { donation } = props
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow
          key={donation.donationId}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="donation">
            {findProjectPropertyValue(donation.projectId, "title")}
          </TableCell>
          <TableCell>{findProjectPropertyValue(donation.projectId, "description")}</TableCell>
          <TableCell>{msToDate(donation.donationDate)}</TableCell>
          <TableCell>{web3.utils.fromWei(donation.donationAmount.toString())}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5} >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ mb: 3 }}>
                <div>Cause : {findProjectPropertyValue(donation.projectId, "cause")}</div>
                <div>Montant minimum : {findProjectPropertyValue(donation.projectId, "minAmount")} EOC</div>
                <div>Montant maximum : {findProjectPropertyValue(donation.projectId, "maxAmount")} EOC</div>
                <div>Total dons : {findProjectPropertyValue(donation.projectId, "projectTotalDonations")} EOC</div>
                <div>Zone géographique : {findProjectPropertyValue(donation.projectId, "geographicalArea")}</div>
                <div>Dates projet : du {msToDate(findProjectPropertyValue(donation.projectId, "startDate"))} au {msToDate(findProjectPropertyValue(donation.projectId, "endDate"))}</div>
                <div>Campagne : début {msToDate(findProjectPropertyValue(donation.projectId, "campaignStartDate"))} pour une durée de {findProjectPropertyValue(donation.projectId, "campaignDurationInDays")} jour(s)</div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
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
        Liste de mes dons
      </Typography>

      {allMyDonations &&
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow selected>
                <TableCell/>
                <TableCell>Projet</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Montant (EOC)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allMyDonations.map((donation) => (
                <DonationRow key={donation.donationId} donation={donation} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>}
    </>
  )
}

export default MyDonations
