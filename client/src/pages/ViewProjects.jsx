import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import LinearProgress from '@mui/material/LinearProgress';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ViewProjects = (props) => {
  const { data, msToDate } = props
  const { web3, isAdmin } = data
  const [allProjects, setAllProjects] = useState(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const statusProject = {
    0: "Indéfini",
    1: "A l'étude",
    2: "Collecte en cours",
    3: "Projet en cours",
    4: "Projet annulé",
    5: "Projet terminé"
  }
  const statusColor = {
    0: "#90a4ae",
    1: "#00b0ff",
    2: "#00bfa5",
    3: "#ce93d8",
    4: "#ff3d00",
    5: "#ff9800"
  }

  useEffect(() => {
    getAllProjects()
  }, []);

  useEffect(() => {
    if (allProjects) {
      console.log('allProjects :>> ', allProjects);
    }
  }, [allProjects]);

  const daysLeft = (x) => {
    let dateNow = new Date()
    return Math.ceil(((+x.campaignStartDate + +x.campaignDurationInDays * 86400) - dateNow.valueOf() / 1000) / 86400)
  }

  const currentPercentage = (x) => {
    return Math.ceil((web3.utils.fromWei(x.projectBalance.toString()) * 100) / web3.utils.fromWei(x.minAmount.toString()))
  }

  const getAllProjects = async () => {
    try {
      const { contract } = data
      await contract.methods.getProjects().call()
        .then(x => setAllProjects(x))

    } catch (error) {
      console.log(error)
    }
  }

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

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  const Row = (props) => {
    const { project } = props
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>

          <TableCell component="th" scope="project">
            {project.title}
          </TableCell>
          <TableCell component="th" scope="project">
            <Typography variant="button" sx={{ fontWeight: 'bold', color: 'white', bgcolor: statusColor[project.status], borderRadius: '3px', px: '5px', py: '1px' }}>{statusProject[project.status].toUpperCase()}</Typography>
          </TableCell>
          <TableCell>{web3.utils.fromWei(project.projectBalance.toString())} EOC</TableCell>
          <TableCell>{web3.utils.fromWei(project.minAmount.toString())} EOC</TableCell>

          {(project.status === "1" || project.status === "0") ?
            <TableCell align="center">-</TableCell>
            :
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Box sx={{ width: '70px', mr: 1 }}>
                  <LinearProgress sx={{ height: '20px', borderRadius: '5px' }} color="secondary" variant="determinate" value={currentPercentage(project) > 100 ? 100 : currentPercentage(project)} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="secondary">{Math.round(currentPercentage(project))}%</Typography>
                </Box>
              </Box>
            </TableCell>
          }

          {project.status === "2" ?
            <TableCell>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <AccessTimeIcon color="disabled" sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="body1" color="text.secondary">J - {daysLeft(project)}</Typography>
              </Box>
            </TableCell>
            :
            <TableCell align="center">-</TableCell>
          }

          {
            isAdmin ?
              <TableCell />
              :
              <TableCell align="right">
                <Link to={`/faireundon/${project.projectId}`}>
                  <Button disabled={(project.status === "2" || project.status === "3") ? false : true}
                    variant="contained" color='secondary' sx={{ minWidth: '120px' }}>
                    <VolunteerActivismIcon size="large" />
                  </Button>
                </Link>
              </TableCell>
          }
        </TableRow>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8} >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ mb: 3 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead >
                    <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                      <TableCell sx={{ typography: 'upper' }}>Description</TableCell>
                      <TableCell sx={{ typography: 'upper' }}>Départ campagne</TableCell>
                      <TableCell sx={{ typography: 'upper' }}>Durée campagne</TableCell>
                      <TableCell sx={{ typography: 'upper' }}>Départ projet</TableCell>
                      <TableCell sx={{ typography: 'upper' }}>NPO</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ border: 0, verticalAlign: 'top' }}>{project.description}</TableCell>
                      <TableCell sx={{ border: 0, width: '150px', verticalAlign: 'top' }}>{msToDate(project.campaignStartDate)}</TableCell>
                      <TableCell sx={{ border: 0, width: '150px', verticalAlign: 'top' }}>{project.campaignDurationInDays} j</TableCell>
                      <TableCell sx={{ border: 0, width: '150px', verticalAlign: 'top' }}>{msToDate(project.startDate)}</TableCell>
                      <TableCell sx={{ border: 0, verticalAlign: 'top' }}>{project.npoErc20Address.match(/^.{8}/)}...</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
        Liste des projets
      </Typography>

      {allProjects &&
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="collapsible table">
            <TableHead>
              <TableRow selected>
                <TableCell />
                <TableCell sx={{ typography: 'upper' }}>Projet</TableCell>
                <TableCell sx={{ typography: 'upper' }}>Statut</TableCell>
                <TableCell sx={{ typography: 'upper' }}>Dons collectés</TableCell>
                <TableCell sx={{ typography: 'upper' }}>Objectif min.</TableCell>
                <TableCell sx={{ typography: 'upper' }}>Financement</TableCell>
                <TableCell sx={{ typography: 'upper' }}>Clôture</TableCell>
                {
                  isAdmin ?
                    <TableCell />
                    :
                    <TableCell sx={{ typography: 'upper' }} align="right">faire un don</TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? allProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : allProjects
              ).map((project) => (
                <Row key={project.projectId} project={project} />
              ))}
            </TableBody>

            <TableFooter >
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={7}
                  count={allProjects.length}
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
        </TableContainer>
      }
    </>
  )
}

export default ViewProjects
