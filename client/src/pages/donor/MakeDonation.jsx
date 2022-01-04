import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import InputAdornment from '@mui/material/InputAdornment';

export default function MakeDonation(props) {
  const { data } = props
  let navigate = useNavigate();
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null)
  const [amoutMin, setAmoutMin] = useState(0)
  const [amoutMinError, setAmoutMinError] = useState(false)

  useEffect(() => {
    getSelectedProject(id)
    console.log('selectedProject :>> ', selectedProject);
  }, []);

  const getSelectedProject = async (params) => {
    const { contract } = data;
    await contract.methods.getProject(params).call()
      .then(x => setSelectedProject(x))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (amoutMin === 0) { setAmoutMinError(true) }
    if (amoutMin) {
      plusDonation()
    }
  }
  console.log(`id`, id)
  const plusDonation = async () => {
    try {
      const { web3, contract, contractTokenEOC, accounts } = data;
      await contractTokenEOC.methods.approve(contract._address, web3.utils.toWei(amoutMin.toString())).send({ from: accounts[0] })
      await contract.methods.addDonation(id, web3.utils.toWei(amoutMin.toString())).send({ from: accounts[0], gas: 2000000 })
        .then(x => navigate('/mesdons'))

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      {selectedProject &&
        <Card sx={{ maxWidth: 500 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {selectedProject.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedProject.description}
            </Typography>
            <br />
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <TextField
                onChange={(e) => setAmoutMin(e.target.value)}
                label="Montant"
                variant='outlined'
                color='secondary'
                InputProps={{
                  endAdornment: <InputAdornment position="end">EOC</InputAdornment>,
                }}
                required
                sx={{ mb: 3 }}
                error={amoutMinError}
              />
              <br />

              <Button
                type="submit"
                color="secondary"
                variant="contained"
                endIcon={<VolunteerActivismIcon />}>
                Donner
              </Button>
            </form>
          </CardContent>
        </Card>
      }
    </>
  )
}