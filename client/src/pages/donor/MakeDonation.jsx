import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import InputAdornment from '@mui/material/InputAdornment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { green } from '@mui/material/colors';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PublicIcon from '@mui/icons-material/Public';

import { Loader } from '../../components/Loader';

export default function MakeDonation(props) {
  const greenColor = green['A100'];
  const { data } = props
  const { web3 } = data
  let navigate = useNavigate();
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedNpo, setSelectedNpo] = useState(null)
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
  }, []);

  useEffect(() => {
    if (selectedProject) {
      console.log('selectedProject :>> ', selectedProject)
      getSelectedNpo()
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedNpo) { console.log('selectedNpo :>> ', selectedNpo) }
  }, [selectedNpo]);

  const daysLeft = () => {
    let dateNow = new Date()
    return Math.ceil(((+selectedProject.campaignStartDate + +selectedProject.campaignDurationInDays * 86400) - dateNow.valueOf() / 1000) / 86400)
  }

  const currentPercentage = () => {
    return Math.ceil((web3.utils.fromWei(selectedProject.projectBalance.toString()) * 100) / web3.utils.fromWei(selectedProject.minAmount.toString()))
  }

  const getSelectedProject = async (params) => {
    const { contract } = data;
    await contract.methods.getProject(params).call()
      .then(x => setSelectedProject(x))
  }

  const getSelectedNpo = async () => {
    const { contract } = data;
    await contract.methods.getNpo(selectedProject.npoErc20Address).call()
      .then(x => setSelectedNpo(x))
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
      {selectedProject && selectedNpo &&
        <Card sx={{ maxWidth: 450, borderRadius: '15px' }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {selectedProject.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedProject.description}
            </Typography>
            <br />
            <CardHeader sx={{ bgcolor: 'secondary.lighten2', borderRadius: '10px' }}
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.dark' }} variant="rounded" aria-label="recipe">
                  <VerifiedUserIcon />
                </Avatar>
              }
              title={selectedNpo.denomination}
              subheader={selectedNpo.postalAddress}
            />
            <br />
            <br />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Montant collecté</Typography>
                <Typography variant="button" sx={{ bgcolor: 'secondary.lighten', borderRadius: '5px', p: 0.7 }}>{web3.utils.fromWei(selectedProject.projectBalance.toString())} EOC</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, textAlign: 'right' }}>Objectif</Typography>
                <Typography variant="button" sx={{ bgcolor: 'secondary.lighten', borderRadius: '5px', p: 0.7, textAlign: 'right' }}>{web3.utils.fromWei(selectedProject.minAmount.toString())} EOC</Typography>
              </Box>
            </Box>
            <br />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress sx={{ height: '8px', borderRadius: '4px' }} color="secondary" variant="determinate" value={currentPercentage() > 100 ? 100 : currentPercentage()} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="secondary">{Math.round(currentPercentage())}%</Typography>
              </Box>
            </Box>
            <br />
            <br />
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  onChange={(e) => setAmoutMin(e.target.value)}
                  label="Montant du don"
                  variant='outlined'
                  color='cherry'
                  InputProps={{
                    endAdornment: <InputAdornment position="end">EOC</InputAdornment>,
                  }}
                  required
                  sx={{ mb: 3, bgcolor: 'secondary.lighten2' }}
                  error={amoutMinError}
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <AccessTimeIcon color="disabled" sx={{ fontSize: 20, mr: 1 }} />
                  {daysLeft() > 0 &&
                    <Typography variant="body1" color="text.secondary">{daysLeft()} jour(s)</Typography>}
                </Box>
              </Box>
              <Button
                fullWidth
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