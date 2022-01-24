import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { Loader } from '../../components/Loader';

export default function Withdrawal(props) {
  const { data } = props
  const { web3 } = data
  let navigate = useNavigate();
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null)
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [description, setDescription] = useState('')
  const [descriptionError, setDescriptionError] = useState(false)
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
    if (selectedProject) { console.log('selectedProject :>> ', selectedProject) }
  }, [selectedProject]);

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setTitleError(false)
    setDescriptionError(false)
    setAmoutMinError(false)
    if (title === '') { setTitleError(true) }
    if (description === '') { setDescriptionError(true) }
    if (amoutMin === 0) { setAmoutMinError(true) }
    if (title && description && amoutMin) {
      withdrawalRequest()
    }
  }

  const withdrawalRequest = async () => {
    try {
      const { web3, contract, accounts } = data;
      setLoaderText({
        text1: 'Transaction en attente',
        text2: 'Validez la transaction dans votre portefeuille',
        text3: 'Transaction effectuée !',
        text4: 'Transaction annulée !'
      })
      setProgress(true)
      setLoaderIsOpen(true)
      await contract.methods.withdrawTokens(id, web3.utils.toWei(amoutMin.toString()), title, description).send({ from: accounts[0], gas: 2000000 })
      setProgress(false)
      setSuccess(true)
      setTimeout(() => navigate('/mesretraits'), 2000)

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
        <Card sx={{ maxWidth: 450, borderRadius: '15px' }}>
          <CardContent>
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <Typography gutterBottom variant="h5" component="div">
                {selectedProject.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedProject.description}
              </Typography>
              <br />
              <br />
              <TextField
                onChange={(e) => setTitle(e.target.value)}
                label="Titre"
                variant='outlined'
                color='cherry'
                fullWidth
                required
                sx={{ mb: 3, bgcolor: 'secondary.lighten2' }}
                error={titleError}
              />
              <TextField
                onChange={(e) => setDescription(e.target.value)}
                label="Comment allez vous utiliser le montant de ce retrait"
                variant='outlined'
                color='cherry'
                multiline
                rows={5}
                fullWidth
                required
                sx={{ mb: 3, bgcolor: 'secondary.lighten2' }}
                error={descriptionError}
              />
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  onChange={(e) => setAmoutMin(e.target.value)}
                  label="Montant du retrait"
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
                endIcon={<ShoppingCartCheckoutOutlinedIcon />}>
                Demander un retrait
              </Button>
            </form>
          </CardContent>
        </Card>
      }

      <Loader loaderIsOpen={loaderIsOpen} progress={progress} success={success} fail={fail} loaderText={loaderText} />
    </>
  )
}