import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Divider, Drawer, Typography } from '@mui/material'
import { Box } from '@mui/system'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { SubjectOutlined, VolunteerActivismOutlined, ListAltOutlined } from '@mui/icons-material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const drawerWidth = 245;

const LayoutDonor = (props) => {
  const { data } = props
  const { accounts } = data
  const [connectedDonor, setConnectedDonor] = useState(null)
  let navigate = useNavigate();
  const location = useLocation()
  const menuItems = [
    {
      text: 'Projets',
      icon: <SubjectOutlined color='secondary' />,
      path: '/projets'
    },
    {
      text: 'Mes Dons',
      icon: <VolunteerActivismOutlined color='secondary' />,
      path: '/mesdons'
    },
    {
      text: 'Historique',
      icon: <ListAltOutlined color='secondary' />,
      path: '/historique'
    },
  ]

  useEffect(() => {
    getConnectedDonor()
  }, []);

  useEffect(() => {
    if (connectedDonor) {
      console.log('connectedDonor :>> ', connectedDonor);
    }
  }, [connectedDonor]);

  const getConnectedDonor = async () => {
    try {
      const { contract, accounts } = data
      await contract.methods.getDonor(accounts[0]).call()
        .then(x => setConnectedDonor(x))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* app bar */}
      <AppBar
        color='secondary'
        position="fixed"
        elevation={0}
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <AccountBoxIcon color="cherry" fontSize="large" />
            <Typography variant="h6" sx={{ mx: 1 }}>
              {connectedDonor && ' ' + connectedDonor[3] + ' ' + connectedDonor[2]}
            </Typography>
            <ArrowRightAltIcon color="disabled" fontSize="large" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              {accounts[0]}
            </Typography>
          </Box>
          <img src="EthicOnChainLogo2.svg" alt="logo" height="30px" />
        </Toolbar>
      </AppBar>

      {/* side drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ bgcolor: 'bckGrd.dark', color: 'bckGrd.light' }}>
          <Typography variant='h5' sx={{ fontWeight: 'fontWeightBold' }}>
            Espace Donateur
          </Typography>
        </Toolbar>
        <Divider />

        {/* list / links */}
        <List>
          {menuItems.map((item, id) => (
            <ListItem
              button
              key={id}
              onClick={() => navigate(item.path)}
              sx={location.pathname === item.path ?
                { bgcolor: 'bckGrd.light', borderRightWidth: '5px', borderRightStyle: 'solid', borderRightColor: 'secondary.main' } :
                null
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: `auto`, textAlign: "center", mb: `30px` }} >
          <img src="EthicOnChainLogoSquare.svg" alt="logo" height="150px" />
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{ bgcolor: 'bckGrd.light', width: '100%', flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />

      </Box>
    </Box>
  )
}

export default LayoutDonor
