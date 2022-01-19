import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

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
    navigate("/")
    window.location.reload()
  }

  return (
    <Box sx={{
      backgroundImage: `url(${HomeImg})`, minHeight: "100vh",
      backgroundRepeat: "no-repeat", backgroundSize: "cover",
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    }}>
      <AppBar
        color='secondary'
        position="fixed"
        elevation={0}
      >
        <Toolbar sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Box>
            <Button
              onClick={go}
              variant="contained" startIcon={<LoginIcon />}>Connexion</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ mb: 10 }}>
        <Box sx={{ textAlign: 'center' }}>
          <img src="EthicOnChainLogo2.svg" alt="logo" height="120px" />
        </Box>
        <Typography sx={{
          fontSize: 50, textAlign: 'center',
          color: 'secondary.light',
          fontFamily: 'Passion One',
          letterSpacing: 3,
          bgcolor: '#242323',
          opacity: '0.9',
          px: 3, pb: 0.5,
          borderRadius: '5px',
        }} >
          La blockchain au service de la philantropie
        </Typography>
      </Box>
    </Box>
  )
};

export default Homepage;
