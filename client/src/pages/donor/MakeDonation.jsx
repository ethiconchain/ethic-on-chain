import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import InputAdornment from '@mui/material/InputAdornment';
import { green } from '@mui/material/colors';

import { Loader } from '../../components/Loader';

export default function MakeDonation(props) {
  const greenColor = green['A100'];
  const { data } = props
  const { web3 } = data
  let navigate = useNavigate();
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null)
  const [amoutMin, setAmoutMin] = useState(0)
  const [amoutMinError, setAmoutMinError] = useState(false)

  const [loaderIsOpen, setLoaderIsOpen] = useState(false);
  const [progress, setProgress] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [loaderText, setLoaderText] = useState({
    text1: '',
    text2: '',
    text3: '',
    text4: '',
  })

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

  const plusDonation = async () => {
    try {
      const { web3, contract, contractTokenEOC, accounts } = data;
      setLoaderText({
        text1: 'Autorisation en attente',
        text2: 'Autorisez la transaction dans votre portefeuille, puis validez',
        text3: 'Transaction autorisée !',
        text4: 'Transaction non autorisée !'
      })
      setProgress(true)
      setLoaderIsOpen(true)
      await contractTokenEOC.methods.approve(contract._address, web3.utils.toWei(amoutMin.toString())).send({ from: accounts[0] })
      setProgress(false)
      setSuccess(true)
      setTimeout(() => {
        setLoaderIsOpen(false)
        setSuccess(false)
        setLoaderText({
          text1: 'Transaction en attente',
          text2: 'Validez la transaction dans votre portefeuille',
          text3: 'Transaction effectuée !',
          text4: 'Transaction annulée !'
        })
        setProgress(true)
        setLoaderIsOpen(true)
      }, 2000)
      await contract.methods.addDonation(id, web3.utils.toWei(amoutMin.toString())).send({ from: accounts[0], gas: 2000000 })
      setProgress(false)
      setSuccess(true)
      setTimeout(() => navigate('/mesdons'), 2000)

    } catch (error) {
      console.log(error)
      setProgress(false)
      setFail(true)
      setTimeout(() => { setLoaderIsOpen(false); setFail(false) }, 2000)
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
            <br />
            <Typography variant="button" sx={{ backgroundColor: greenColor, borderRadius: '5px', p: 1 }}>
              Le montant actuel récolté est de {web3.utils.fromWei(selectedProject.projectBalance.toString())} EOC
            </Typography>
            <br />
            <br />
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <TextField
                onChange={(e) => setAmoutMin(e.target.value)}
                label="Montant du don"
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

      <Loader loaderIsOpen={loaderIsOpen} progress={progress} success={success} fail={fail} loaderText={loaderText} />
    </>
  )
}