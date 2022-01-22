import React from 'react'
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Fade from '@mui/material/Fade';

export const Loader = (props) => {
  const { loaderIsOpen, progress, success, fail, loaderText } = props
  const { text1, text2, text3, text4 } = loaderText

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loaderIsOpen}
    >
      <Card sx={{
        minWidth: 350, minHeight: 225, borderRadius: '15px', display: "flex", alignItems: 'center', justifyContent: 'center'

      }}>
        {progress &&
          <CardContent sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: 'cherry.light' }} size="90px" thickness="15" />
            <br />
            <br />
            <Typography sx={{ fontSize: 19 }}>
              {text1}
            </Typography>
            <Typography gutterBottom variant="body2" color="text.secondary">
              {text2}
            </Typography>
          </CardContent>
        }
        {success &&
          <CardContent sx={{ textAlign: 'center' }}>
            <Fade in={success}>
              <CheckCircleOutlineIcon sx={{ fontSize: 100 }} color='success' />
            </Fade>
            <Fade in={success}>
              <Typography sx={{ fontSize: 25 }} >
                {text3}
              </Typography>
            </Fade>
          </CardContent>
        }
        {fail &&
          <CardContent sx={{ textAlign: 'center' }}>
            <Fade in={fail}>
              <HighlightOffIcon sx={{ fontSize: 100 }} color='error' />
            </Fade>
            <Fade in={fail}>
              <Typography sx={{ fontSize: 25 }} >
                {text4}
              </Typography>
            </Fade>
          </CardContent>
        }
      </Card>
    </Backdrop>
  )
}
