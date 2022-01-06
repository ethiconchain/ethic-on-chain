import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import Button from '@mui/material/Button';

const MyProjects = (props) => {
  const { data, msToDate } = props
  const [allMyProjects, setAllMyProjects] = useState(null)

  useEffect(() => {
    getMyProjects()
  }, []);

  useEffect(() => {
    console.log('allMyProjects :>> ', allMyProjects);
  }, [allMyProjects]);

  const getMyProjects = async () => {
    try {
      const { contract, accounts } = data
      await contract.methods.getProjectsPerNpo(accounts[0]).call()
        .then(x => setAllMyProjects(x))
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
        Liste de mes projets
      </Typography>

      {allMyProjects &&
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow selected>
                <TableCell>Titre</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Début campagne</TableCell>
                <TableCell>Durée campagne (j)</TableCell>
                <TableCell>Demande de retrait</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allMyProjects.map((project) => (
                <TableRow
                  key={project.title}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="project">
                    {project.title}
                  </TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{msToDate(project.campaignStartDate)}</TableCell>
                  <TableCell>{project.campaignDurationInDays}</TableCell>
                  <TableCell>
                    <Link to={`/retrait/${project.projectId}`}>
                      <Button variant="contained" color='secondary'
                      >
                        <ShoppingCartCheckoutOutlinedIcon size="large" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}
    </>
  )
}

export default MyProjects
