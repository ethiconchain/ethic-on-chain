import React from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const LoaderGlobal = () => {

  return (
    <Box sx={{ bgcolor: 'bckGrd.lighten', display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ fzIndex: 'tooltip', position: 'absolute' }}>
        <Typography sx={{ fontSize: 25 }} >
          Chargement
        </Typography>
        <Typography sx={{ fontSize: 25, textAlign: 'center' }} >
          en cours
        </Typography>
      </Box>
      <CircularProgress size="250px" thickness="4" sx={{ color: 'cherry.light', zIndex: 'modal', position: 'absolute' }} />
    </Box>
  )
}

export default LoaderGlobal
