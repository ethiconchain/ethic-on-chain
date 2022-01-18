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
import { AddCircleOutlineOutlined, ListAltOutlined, SubjectOutlined } from '@mui/icons-material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import PublicIcon from '@mui/icons-material/Public';

const drawerWidth = 240;

const LayoutNpo = (props) => {
  const { data } = props
  const { accounts } = data
  const [connectedNpo, setConnectedNpo] = useState(null)
  let navigate = useNavigate();
  const location = useLocation()
  const menuItems = [
    {
      text: 'Mes projets',
      icon: <SubjectOutlined color='secondary' />,
      path: '/mesprojets'
    },
    {
      text: 'Créer un projet',
      icon: <AddCircleOutlineOutlined color='secondary' />,
      path: '/creerprojet'
    },
    {
      text: 'Mes demandes de retrait',
      icon: <ShoppingCartOutlinedIcon color='secondary' />,
      path: '/mesretraits'
    },
    {
      text: 'Historique',
      icon: <ListAltOutlined color='secondary' />,
      path: '/historique'
    },
  ]

  useEffect(() => {
    getConnectedNpo()
  }, []);

  useEffect(() => {
    if (connectedNpo) {
      console.log('connectedNpo :>> ', connectedNpo);
    }
  }, [connectedNpo]);

  const getConnectedNpo = async () => {
    try {
      const { contract, accounts } = data
      await contract.methods.getNpo(accounts[0]).call()
        .then(x => setConnectedNpo(x))
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
            <PublicIcon />
            <Typography variant="h6" sx={{ mx: 1 }}>
              {connectedNpo && connectedNpo[2]}
            </Typography>
            <ArrowRightAltIcon color="disabled" fontSize="large" />
            <Typography sx={{ ml: 1 }}>
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
        <Toolbar sx={{ bgcolor: '#f9f9f9' }}>
          <Typography variant='h5'>
            Espace NPO
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
              sx={{ bgcolor: location.pathname === item.path ? '#f4f4f4' : null }}
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
        sx={{ bgcolor: '#f9f9f9', width: '100%', flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />

      </Box>
    </Box>
  )
}

export default LayoutNpo
