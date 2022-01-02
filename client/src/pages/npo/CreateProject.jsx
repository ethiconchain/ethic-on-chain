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
      // console.log('title :>> ', title);
      // console.log('zone :>> ', zone);
      // console.log('description :>> ', description);
      // console.log('timeValueBegin :>> ', timeValueBegin);
      // console.log('timeValueEnd :>> ', timeValueEnd);
      // console.log('timeValueCampaign :>> ', timeValueCampaign);
      // console.log('nbDays :>> ', nbDays);
      // console.log('amoutMin :>> ', amoutMin);
      // console.log('amoutMax :>> ', amoutMax);
    }
  }

  const plusProject = async () => {
    try {
      const { contract, accounts } = data;
      await contract.methods.addProject(title, description, zone, timeValueBegin.toString(), timeValueEnd.toString(), timeValueCampaign.toString(), nbDays, amoutMin, amoutMax).send({ from: accounts[0] })
        .then(x => navigate('/mesprojets'))

      // navigate('/mesprojets')
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
            onClick={() => console.log('you clicked me')}
            type="submit"
            color="secondary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}>
            Enregistrer
          </Button>
        </form>
      </Container>
    </LocalizationProvider>
  )
}