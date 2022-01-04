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
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import Button from '@mui/material/Button';


const ViewProjects = (props) => {
  const { data, msToDate } = props
  const [allProjects, setAllProjects] = useState(null)

  useEffect(() => {
    getAllProjects()
  }, []);

  useEffect(() => {
    console.log('allProjects :>> ', allProjects);
  }, [allProjects]);

  const getAllProjects = async () => {
    try {
      const { contract } = data
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
        Liste des projets
      </Typography>

      {allProjects &&
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow selected>
                <TableCell>Titre</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Début campagne</TableCell>
                <TableCell>Durée campagne (j)</TableCell>
                <TableCell>Faire un don</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProjects.map((project) => (
                <TableRow
                  key={project.projectId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="project">
                    {project.title}
                  </TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{msToDate(project.campaignStartDate)}</TableCell>
                  <TableCell>{project.campaignDurationInDays}</TableCell>
                  <TableCell>
                    <Link to={`/faireundon/${project.projectId}`}>
                      <Button variant="contained" color='secondary'
                      >
                        <VolunteerActivismIcon size="large" />
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

export default ViewProjects
