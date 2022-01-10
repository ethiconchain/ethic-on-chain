import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';

import EthicOnChainContract from "./contracts/EthicOnChain.json";
import EthicTokenContract from "./contracts/EthicToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import LayoutAdmin from "./components/LayoutAdmin";
import LayoutNpo from "./components/LayoutNpo";
import LayoutDonor from "./components/LayoutDonor";
import ViewProjects from "./pages/ViewProjects";
import ViewNpos from "./pages/admin/ViewNpos";
import ViewDonors from "./pages/admin/ViewDonors";
import Historic from "./pages/Historic";
import MakeDonation from "./pages/donor/MakeDonation";
import MyDonations from "./pages/donor/MyDonations";
import CreateProject from "./pages/npo/CreateProject";
import MyProjects from "./pages/npo/MyProjects";
import Withdrawal from "./pages/npo/Withdrawal";
import MyWithdrawals from "./pages/npo/MyWithdrawals";
import Page404 from "./pages/Page404";

const theme = createTheme({
  palette: {
    backgr: {
      main: '#dfe3eb',
      dark: '#adb1b9',
    },
    primary: {
      main: '#01004e',
    },
    secondary: {
      main: '#f54700',
      light: '#fc7723',
    },
    info: {
      main: '#2292cb',
    },
    success: {
      main: '#5fb200',
    },
    warning: {
      main: '#ffc472',
    },
    error: {
      main: '#f80065',
    },
    accent1: {
      main: '#0a8eb8',
    },
    accent2: {
      main: '#0a7592',
    },
    accent3: {
      main: '#27afaf',
    },
  },
  typography: {
    fontFamily: 'Mulish',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  }
});

const greyColor = grey[400]

const App = () => {
  let navigate = useNavigate();
  const addressZero = "0x0000000000000000000000000000000000000000"
  const [data, setData] = useState({
    web3: null,
    accounts: null,
    contract: null,
    contractTokenEOC: null,
    isAdmin: null,
    isNpo: null,
    isDonor: null
  });
  const [allNpos, setAllNpos] = useState(null)
  const [allDonors, setAllDonors] = useState(null)

  const [balance0, setBalance0] = useState(0)
  const [balanceActualAccount, setBalanceActualAccount] = useState(0)

  // convertit date epoch (ms) en date JJ/MM/YY
  const msToDate = (x) => new Date(x * 1000).toLocaleDateString()

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts) => {
      // reload la page aprés changement de compte dans Metamask
      navigate("/")
      window.location.reload()
    });
  });

  useEffect(() => {
    console.log(`Npos`, allNpos)
  }, [allNpos]);
  useEffect(() => {
    console.log(`Donors`, allDonors)
  }, [allDonors]);

  const init = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EthicOnChainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EthicOnChainContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const deployedNetworkTokenEOC = EthicTokenContract.networks[networkId];
      const instanceTokenEOC = new web3.eth.Contract(
        EthicTokenContract.abi,
        deployedNetworkTokenEOC && deployedNetworkTokenEOC.address,
      );

      const account = accounts[0];
      let isAnAdmin = false;
      let isANpo = false;
      let isADonor = false;
      let Admin = await instance.methods.owner().call()
        .then(x => x.toUpperCase())
      Admin === account.toUpperCase() ? isAnAdmin = true : isAnAdmin = false

      await instance.methods.getNpos().call()
        .then(x => setAllNpos(x))
      await instance.methods.getDonors().call()
        .then(x => setAllDonors(x))

      await instance.methods.getNpo(account).call()
        .then(x => x[1] !== addressZero ? isANpo = true : isANpo = false)
      await instance.methods.getDonor(account).call()
        .then(x => x[1] !== addressZero ? isADonor = true : isADonor = false)

      setData({ web3, accounts, contract: instance, contractTokenEOC: instanceTokenEOC, isAdmin: isAnAdmin, isNpo: isANpo, isDonor: isADonor });

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  const getBalanceOwner = async (acc) => {
    const { contract } = data
    await contract.methods.balanceOf(acc).call()
      .then(a => setBalance0(web3.utils.fromWei(a)))
  };

  const getBalanceActualAccount = async (acc) => {
    const { contract } = data
    await contract.methods.balanceOf(acc).call()
      .then(a => setBalanceActualAccount(web3.utils.fromWei(a)))
  };

  const { web3, isAdmin, isDonor, isNpo } = data
  return !web3 ? (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <Routes>
        {isAdmin &&
          <Route path="/" element={<LayoutAdmin data={data} />}>
            <Route path="/projets" element={<ViewProjects data={data} msToDate={msToDate} />} />
            <Route path="/npos" element={<ViewNpos data={data} allNpos={allNpos} />} />
            <Route path="/donateurs" element={<ViewDonors data={data} allDonors={allDonors} />} />
            <Route path="/historique" element={<Historic data={data} />} />
            <Route path="/*" element={<Page404 />} />
          </Route>}
        {isNpo &&
          <Route path="/" element={<LayoutNpo data={data} />}>
            <Route path="/mesprojets" element={<MyProjects data={data} msToDate={msToDate} />} />
            <Route path="/creerprojet" element={<CreateProject data={data} />} />
            <Route path="/mesretraits" element={<MyWithdrawals data={data} msToDate={msToDate} />} />
            <Route path="/retrait/:id" element={<Withdrawal data={data} />} />
            <Route path="/historique" element={<Historic data={data} />} />
            <Route path="/*" element={<Page404 />} />
          </Route>}
        {isDonor &&
          <Route path="/" element={<LayoutDonor data={data} />}>
            <Route path="/projets" element={<ViewProjects data={data} msToDate={msToDate} />} />
            <Route path="/mesdons" element={<MyDonations data={data} msToDate={msToDate} />} />
            <Route path="/faireundon/:id" element={<MakeDonation data={data} />} />
            <Route path="/historique" element={<Historic data={data} />} />
            <Route path="/*" element={<Page404 />} />
          </Route>}
      </Routes>

      {!isAdmin && !isNpo && !isDonor &&
        <Box sx={{ bgcolor: '#f9f9f9', display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: 25, textAlign: 'center' }} >
            Votre addresse n'est pas enregistrée
          </Typography>
          <Box sx={{ textAlign: "center", mt: `30px` }} >
            <img src="EthicOnChainLogoSquare.svg" alt="logo" height="150px" />
          </Box>
        </Box>
      }
    </ThemeProvider>
  );
}

export default App;
