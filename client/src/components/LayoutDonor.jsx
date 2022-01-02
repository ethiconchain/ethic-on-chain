import React from 'react'
import { Divider, Drawer, Typography } from '@mui/material'
import { Box } from '@mui/system'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { AddCircleOutlineOutlined, VolunteerActivismOutlined, ListAltOutlined } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const drawerWidth = 240;

const LayoutDonor = () => {
  let navigate = useNavigate();
  const location = useLocation()
  const menuItems = [
    {
      text: 'Mes Dons',
      icon: <VolunteerActivismOutlined color='secondary' />,
      path: '/mesdons'
    },
    {
      text: 'Faire un Don',
      icon: <AddCircleOutlineOutlined color='secondary' />,
      path: '/faireundon'
    },
    {
      text: 'Historique',
      icon: <ListAltOutlined color='secondary' />,
      path: '/historique'
    },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      {/* app bar */}
      <AppBar
        color='secondary'
        position="fixed"
        elevation={0}
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Ethic-On-Chain
          </Typography>
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
        <Toolbar>
          <Typography variant='h5'>
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
              sx={{ bgcolor: location.pathname === item.path ? '#f4f4f4' : null }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

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

export default LayoutDonor
