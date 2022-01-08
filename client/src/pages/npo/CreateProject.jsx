import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { Grid } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { Loader } from '../../components/Loader';

export default function CreateProject(props) {
  const { data } = props
  let navigate = useNavigate();
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [zone, setZone] = useState('')
  const [zoneError, setZoneError] = useState(false)
  const [description, setDescription] = useState('')
  const [descriptionError, setDescriptionError] = useState(false)
  const [nbDays, setNbDays] = useState(0)
  const [nbDaysError, setNbDaysError] = useState(false)
  const [amoutMin, setAmoutMin] = useState(0)
  const [amoutMinError, setAmoutMinError] = useState(false)
  const [amoutMax, setAmoutMax] = useState(0)
  const [amoutMaxError, setAmoutMaxError] = useState(false)
  const [timeValueBegin, setTimeValueBegin] = useState(null)
  const [timeValueEnd, setTimeValueEnd] = useState(null)
  const [timeValueCampaign, setTimeValueCampaign] = useState(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setTitleError(false)
    setDescriptionError(false)
    setZoneError(false)
    setNbDaysError(false)
    setAmoutMinError(false)

    if (title === '') { setTitleError(true) }
    if (description === '') { setDescriptionError(true) }
    if (zone === '') { setZoneError(true) }
    if (nbDays === 0) { setNbDaysError(true) }
    if (amoutMin === 0) { setAmoutMinError(true) }
    if (amoutMax === 0) { setAmoutMaxError(true) }
    if (title && description) {
      plusProject()
    }
  }

  const plusProject = async () => {
    try {
      const { web3, contract, accounts } = data;
      setLoaderText({
        text1: 'Enregistrement en attente',
        text2: "Validez l'enregistrement dans votre portefeuille",
        text3: 'Enregistrement effectué !',
        text4: 'Enregistrement annulé !'
      })
      setProgress(true)
      setLoaderIsOpen(true)
      await contract.methods.addProject(title, description, zone,
        Math.round(timeValueBegin.valueOf() / 1000),
        Math.round(timeValueEnd.valueOf() / 1000),
        Math.round(timeValueCampaign.valueOf() / 1000),
        nbDays, web3.utils.toWei(amoutMin.toString()),
        web3.utils.toWei(amoutMax.toString())).send({ from: accounts[0] })
      setProgress(false)
      setSuccess(true)
      setTimeout(() => navigate('/mesprojets'), 2000)

    } catch (error) {
      console.log(error)
      setProgress(false)
      setFail(true)
      setTimeout(() => { setLoaderIsOpen(false); setFail(false) }, 2000)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container size="sm">
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Création d'un nouveau projet
        </Typography>

        <form noValidate autoComplete='off' onSubmit={handleSubmit}>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            label="Titre"
            variant='outlined'
            color='secondary'
            fullWidth
            required
            sx={{ mb: 3 }}
            error={titleError}
          />
          <TextField
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
            variant='outlined'
            color='secondary'
            multiline
            rows={4}
            fullWidth
            required
            sx={{ mb: 3 }}
            error={descriptionError}
          />
          <TextField
            onChange={(e) => setZone(e.target.value)}
            label="Zone géographique"
            variant='outlined'
            color='secondary'
            fullWidth
            required
            sx={{ mb: 3 }}
            error={zoneError}
          />
          <Grid container spacing={3}>
            <Grid item >
              <DatePicker
                label="Départ du projet"
                value={timeValueBegin}
                onChange={(newValue) => {
                  setTimeValueBegin(newValue.valueOf());
                }}
                renderInput={(params) => <TextField {...params} />}
                sx={{ mr: 3 }}
              />
            </Grid>
            <Grid item >
              <DatePicker
                label="Fin du projet"
                value={timeValueEnd}
                onChange={(newValue) => {
                  setTimeValueEnd(newValue.valueOf());
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item >
              <DatePicker
                label="Départ de la campagne"
                value={timeValueCampaign}
                onChange={(newValue) => {
                  setTimeValueCampaign(newValue.valueOf());
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item >
              <TextField
                onChange={(e) => setNbDays(e.target.value)}
                label="Durée de la campagne"
                variant='outlined'
                color='secondary'
                InputProps={{
                  endAdornment: <InputAdornment position="end">jours</InputAdornment>,
                }}
                fullWidth
                required
                sx={{ mb: 3 }}
                error={nbDaysError}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item >
              <TextField
                onChange={(e) => setAmoutMin(e.target.value)}
                label="Montant min. valide"
                variant='outlined'
                color='secondary'
                InputProps={{
                  endAdornment: <InputAdornment position="end">EOC</InputAdornment>,
                }}
                fullWidth
                required
                sx={{ mb: 3 }}
                error={amoutMinError}
              />
            </Grid>
            <Grid item >
              <TextField
                onChange={(e) => setAmoutMax(e.target.value)}
                label="Montant max. valide"
                variant='outlined'
                color='secondary'
                InputProps={{
                  endAdornment: <InputAdornment position="end">EOC</InputAdornment>,
                }}
                fullWidth
                required
                sx={{ mb: 3 }}
                error={amoutMaxError}
              />
            </Grid>
          </Grid>
          <br />

          <Button
            // disabled="false"
            type="submit"
            color="secondary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}>
            Enregistrer
          </Button>
        </form>
      </Container>

      <Loader loaderIsOpen={loaderIsOpen} progress={progress} success={success} fail={fail} loaderText={loaderText} />
    </LocalizationProvider>
  )
}