import React, { useState, useEffect } from "react";
import orderBy from "lodash/orderBy";

import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const MyDonations = (props) => {
  const { data, msToDate, stringValue } = props
  const { web3 } = data
  const [allMyDonations, setAllMyDonations] = useState(null)
  const [allProjects, setAllProjects] = useState(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [direction, setDirection] = useState('desc');

  useEffect(() => {
    getMyDonations()
  }, []);

  useEffect(() => {
    if (allMyDonations) {
      console.log('allMyDonations :>> ', allMyDonations);
    }
  }, [allMyDonations]);

  useEffect(() => {
    if (allProjects) {
      console.log('allProjects :>> ', allProjects);
    }
  }, [allProjects]);

  const findProjectPropertyValue = (id, info) => {
    return allProjects.find(x => x.projectId === id.toString())
  }

  const getMyDonations = async () => {
    try {
      const { contract, accounts } = data
      await contract.methods.getDonationPerDonor(accounts[0]).call()
        .then(x => setAllMyDonations(orderBy(x, x => +x['donationDate'], 'desc')))
      await contract.methods.getProjects().call()
        .then(x => setAllProjects(x))

    } catch (error) {
      console.log(error)
    }
  }

  const handleSort = (columnName) => {
    direction === 'desc' ? setDirection('asc') : setDirection('desc')
    if (columnName === 'projet') {
      let res = orderBy(allMyDonations,
        x => findProjectPropertyValue(x.projectId).title,
        direction)
      setAllMyDonations(res)
    } else if (columnName === 'zone') {
      let res = orderBy(allMyDonations,
        x => findProjectPropertyValue(x.projectId).geographicalArea,
        direction)
      setAllMyDonations(res)
    } else {
      let res = stringValue.includes(columnName) ?
        orderBy(allMyDonations, [columnName], direction) :
        orderBy(allMyDonations, x => +x[columnName], direction)
      setAllMyDonations(res)
    }
  };

  const SortTheTable = (props) => {
    const { name, columnName } = props

    return (
      <Button onClick={() => handleSort(columnName)} variant="text" sx={{ p: 0, color: 'white', typography: 'upper' }}
        endIcon={<ArrowDropDownIcon />}
      >{name}</Button>
    )
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="xl">
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Liste de mes dons
        </Typography>

        {allMyDonations && allProjects &&
          <TableContainer component={Paper}>
            <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: 'bckGrd.main' }}>
                <TableRow selected>
                  <TableCell><SortTheTable name='Projet' columnName='projet' /></TableCell>
                  <TableCell><SortTheTable name='Zone' columnName='zone' /></TableCell>
                  <TableCell sx={{ typography: 'upper', color: 'white' }}>Description</TableCell>
                  <TableCell sx={{ typography: 'upper', color: 'white', whiteSpace: 'nowrap' }}>Dates du projet</TableCell>
                  <TableCell sx={{ typography: 'upper', color: 'white' }}>Campagne</TableCell>
                  <TableCell><SortTheTable name='Date' columnName='donationDate' /></TableCell>
                  <TableCell><SortTheTable name='Montant' columnName='donationAmount' /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? allMyDonations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : allMyDonations
                ).map((donation) => (
                  <TableRow
                    key={donation.donationId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ verticalAlign: 'top', bgcolor: 'bckGrd.lighten', fontWeight: 'fontWeightBold' }} component="th" scope="donation">
                      {findProjectPropertyValue(donation.projectId).title}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{findProjectPropertyValue(donation.projectId).geographicalArea}</TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{findProjectPropertyValue(donation.projectId).description}</TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>Du {msToDate(findProjectPropertyValue(donation.projectId).startDate)} au {msToDate(findProjectPropertyValue(donation.projectId).endDate)}</TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>Début {msToDate(findProjectPropertyValue(donation.projectId).campaignStartDate)} pour une durée de {findProjectPropertyValue(donation.projectId).campaignDurationInDays} jour(s)</TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{msToDate(donation.donationDate)}</TableCell>
                    <TableCell sx={{ verticalAlign: 'top', fontWeight: 'fontWeightMedium', color: 'secondary.darken', bgcolor: 'secondary.lighten', whiteSpace: 'nowrap' }}>{(+web3.utils.fromWei(donation.donationAmount.toString())).toLocaleString()} EOC</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={7}
                    count={allMyDonations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="Lignes par page"
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'Lignes par page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>}
      </Container>
    </>
  )
}

export default MyDonations
