import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ViewProjects = (props) => {
  const { data, msToDate } = props
  let navigate = useNavigate();
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
      // console.log(`error`, error.message)
      // if (/Already registered/.test(error.message)) {
      //   setMessageAlert('Adresse déjà enregistrée !')
      //   setShowAlert(true)
      // } else if (/caller is not the owner/.test(error.message)) {
      //   setMessageAlert("Vous n'êtes pas l'administrateur !")
      //   setShowAlert(true)
      // } else if (/Voters registration is not open yet/.test(error.message)) {
      //   setMessageAlert('Enregistrement des voteurs inactive !')
      //   setShowAlert(true)
      // } else if (/The address cannot be empty/.test(error.message)) {
      //   setMessageAlert("L'adresse ne peut être vide !")
      //   setShowAlert(true)
      // } else {
      //   setMessageAlert('Erreur inconnue voter')
      //   setShowAlert(true)
      // }
    }
    // setContentForm("")
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
              </TableRow>
            </TableHead>
            <TableBody>
              {allProjects.map((project) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}
    </>
  )
}

export default ViewProjects
