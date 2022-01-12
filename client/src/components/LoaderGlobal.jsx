import React from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';

const LoaderGlobal = () => {
  const greyColor = grey[400]

  return (
    <Box sx={{ bgcolor: '#f9f9f9', display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ fzIndex: 'tooltip', position: 'absolute' }}>
        <Typography sx={{ fontSize: 25 }} >
          Chargement
        </Typography>
        <Typography sx={{ fontSize: 25, textAlign: 'center' }} >
          en cours
        </Typography>
      </Box>
      <CircularProgress size="250px" thickness="4" sx={{ color: greyColor, zIndex: 'modal', position: 'absolute' }} />
    </Box>
  )
}

export default LoaderGlobal
