import React from "react";
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

import HomeImg from "../img/Home.jpg"

const Homepage = () => {
  let navigate = useNavigate();

  const go = () => {
    navigate("/routes/")
    window.location.reload()
  }

  return (
    <Box sx={{
      backgroundImage: `url(${HomeImg})`, minHeight: "100vh",
      backgroundRepeat: "no-repeat", backgroundSize: "cover",
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'flex-start'
    }}>
      <AppBar
        color='secondary'
        position="fixed"
        elevation={0}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src="EthicOnChainLogo2.svg" alt="logo" height="30px" />
          </Box>
          <Button
            color="cherry"
            onClick={go}
            variant="contained" size="large" startIcon={<LoginIcon />}>Connexion</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{
        maxWidth: 590,
        mt: '11%', ml: '7%', p: 5,
        bgcolor: '#232222',
        opacity: '0.8', borderRadius: '10px'
      }}>
        <Box>
          <img src="philanthropie.svg" alt="logo" height="230px" />
        </Box>
        <Typography sx={{
          mt: 4.5,
          fontSize: 19,
          color: 'white'
        }} >
          Ethic-On-Chain est une plateforme de crowdfunding en faveur de projets philanthropiques. Nous mettons en relation donateurs et fondations, tout en garantissant la transparence et le respect de la réglementation.
        </Typography>
      </Box>
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        mb: 5, mr: 5
      }} >
        <img src="EthicOnChainLogoSquareFondBlanc.svg" alt="logo" height="200px" />
      </Box>
    </Box>
  )
};

export default Homepage;
