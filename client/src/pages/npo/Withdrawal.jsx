import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import InputAdornment from '@mui/material/InputAdornment';

export default function Withdrawal(props) {
  const { data } = props
  const { web3 } = data
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
      withdrawalRequest()
    }
  }
  console.log(`id`, id)
  const withdrawalRequest = async () => {
    try {
      const { web3, contract, contractTokenEOC, accounts } = data;
      await contractTokenEOC.methods.approve(contract._address, web3.utils.toWei(amoutMin.toString())).send({ from: accounts[0] })
      await contract.methods.withdrawTokens(id, web3.utils.toWei(amoutMin.toString()), selectedProject.title, selectedProject.description).send({ from: accounts[0], gas: 2000000 })
        .then(x => navigate('/mesretraits'))

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
            <br />
            <Typography variant="button" sx={{ backgroundColor: '#B7EFCF', borderRadius: '5px', p: 1 }}>
              Le montant actuel récolté est de {web3.utils.fromWei(selectedProject.projectBalance.toString())} EOC
            </Typography>
            <br />
            <br />
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <TextField
                onChange={(e) => setAmoutMin(e.target.value)}
                label="Montant du retrait"
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
                endIcon={<ShoppingCartCheckoutOutlinedIcon />}>
                Demander un retrait
              </Button>
            </form>
          </CardContent>
        </Card>
      }
    </>
  )
}