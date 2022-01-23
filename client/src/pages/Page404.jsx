import React from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Page404 = () => {
  return (
    <Box sx={{ bgcolor: 'bckGrd.lighten', display: 'flex', height: '100vh' }}>
      <Typography variant="h5" >
        Cette page n'existe pas
      </Typography>
    </Box>
  )
}

export default Page404
